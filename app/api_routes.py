from flask import (
    Flask,
    Blueprint,
    request,
    jsonify,
    session,
    Response,
)
import re

from sqlalchemy import func
from .models import User, Chatbot, Chat, Image
from sqlalchemy.exc import IntegrityError
from flask_login import login_user
from typing import Union, List, Optional, Dict
from .ai import chat_with_chatbot
from .constants import BOT_AVATAR_API, USER_AVATAR_API
from .helpers import create_default_chatbots
from datetime import datetime
import re
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    current_user,
    verify_jwt_in_request,
)

ANONYMOUS_MESSAGE_LIMIT = 5

api_bp = Blueprint("api", __name__)
# Initialize variables for db and bcrypt
db = None
bcrypt = None


def register_api_routes(app: Flask, database, bcrypt_instance) -> None:
    global db, bcrypt
    db = database
    bcrypt = bcrypt_instance
    app.register_blueprint(api_bp)


def is_strong_password(password: str) -> bool:
    """Check if the password meets strength criteria."""
    if (
        len(password) < 8
        or not re.search(r"[A-Z]", password)
        or not re.search(r"[a-z]", password)
        or not re.search(r"[0-9]", password)
        or not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)
    ):
        return False
    return True


def get_current_user():
    uid: str = get_jwt_identity()
    user = User.query.get(uid)
    return user


@api_bp.route("/api/login", methods=["POST"])
def api_login() -> Union[Response, tuple[Response, int]]:
    """API endpoint to log in a user."""
    login_type: str = request.args.get("type", "jwt").lower()
    if login_type == "session":
        username: str = request.form["username"]
        password: str = request.form["password"]
    else:
        data = request.get_json()  # Use JSON payload instead of form data

        username: str = data.get("username")
        password: str = data.get("password")

    user: Optional[User] = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        # temp. condition
        # TODO: keep only jwt
        if login_type == "session":
            login_user(user)
            return jsonify({"success": True, "message": "User logged in successfully."})
        else:
            access_token = create_access_token(identity=user.id, expires_delta=False)
            return jsonify({"success": True, "access_token": access_token}), 200
    return (
        jsonify({"success": False, "message": "Invalid username or password."}),
        400,
    )


@api_bp.route("/api/signup", methods=["POST"])
def api_signup() -> Union[Response, tuple[Response, int]]:
    """API endpoint to sign up a new user."""
    login_type: str = request.args.get("type", "jwt").lower()

    if login_type == "session":
        username: str = request.form["username"]
        name: str = request.form["name"]
        password: str = request.form["password"]
        email: str = request.form["email"]
    else:
        data = request.get_json()  # Use JSON payload instead of form data

        username: str = data.get("username")
        name: str = data.get("name")
        password: str = data.get("password")
        email: str = data.get("email")
    if not is_strong_password(password):
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.",
                }
            ),
            400,
        )
        # Check if username or email already exists
    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()
    if existing_user:
        return (
            jsonify({"success": False, "message": "Username or email already exists."}),
            400,
        )

    hashed_password: str = bcrypt.generate_password_hash(password).decode("utf-8")
    avatar = f"{USER_AVATAR_API}/{name}"
    new_user: User = User(
        name=name,
        username=username,
        email=email,
        password=hashed_password,
        avatar=avatar,
        bio="I am Bot maker",
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"success": True, "message": "User registered successfully."})
    except IntegrityError:
        db.session.rollback()
        return (
            jsonify({"success": False, "message": "Username or email already exists."}),
            400,
        )


@api_bp.route("/api/create_chatbot", methods=["POST"])
@jwt_required()
def api_create_chatbot() -> Response:
    """API endpoint to create a new chatbot."""
    login_type: str = request.args.get("type", "jwt").lower()
    if login_type == "session":
        chatbot_name: str = request.form["chatbot_name"]
        chatbot_prompt: str = request.form["chatbot_prompt"]
    else:
        data = request.get_json()
        chatbot_name: str = data.get("name")
        chatbot_prompt: str = data.get("prompt")

    user = get_current_user()
    chatbot: Chatbot = Chatbot(
        name=chatbot_name,
        user_id=user.id,
        prompt=chatbot_prompt,
        generated_by=user.username,
        avatar=f"{BOT_AVATAR_API}/{chatbot_name}",
    )

    db.session.add(chatbot)
    db.session.commit()
    return jsonify({"success": True, "message": "Chatbot created."})


@api_bp.route("/api/chatbot/<int:chatbot_id>/update", methods=["POST"])
@jwt_required()
def api_update_chatbot(chatbot_id: int) -> Union[Response, str]:
    """API endpoint to update an existing chatbot."""
    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)
    user = get_current_user()
    if chatbot.user_id != user.id:
        return jsonify(
            {"success": False, "message": "You don't have permission for this action."}
        )

    data = request.get_json()
    chatbot.name = data.get("name")
    chatbot.prompt = data.get("prompt")

    db.session.commit()
    return jsonify({"success": True, "message": "Chatbot Updated."})


@api_bp.route("/api/chatbot/<int:chatbot_id>/delete", methods=["POST"])
@jwt_required()
def api_delete_chatbot(chatbot_id: int) -> Union[Response, tuple[Response, int]]:
    """API endpoint to delete a chatbot."""
    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)
    user = get_current_user()
    if chatbot.user_id != user.id:
        return (
            jsonify({"error": "Unauthorized access."}),
            403,
        )

    db.session.delete(chatbot)
    db.session.commit()

    return (
        jsonify(
            {"message": f"Chatbot '{chatbot.name}' has been deleted successfully."}
        ),
        200,
    )


@api_bp.route("/api/chatbot/<int:chatbot_id>", methods=["POST", "GET"])
@jwt_required()
def api_chatbot(chatbot_id: int) -> Union[Response, tuple[Response, int]]:
    """API endpoint to interact with a chatbot."""

    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)
    user = get_current_user()

    if (
        chatbot.user_id != user.id
        and not chatbot.public
        and chatbot.generated_by != "system"
    ):
        return jsonify({"success": False, "message": "Access denied."}), 403

    chats: List[Chat] = Chat.query.filter_by(
        chatbot_id=chatbot_id, user_id=user.id
    ).all()

    if request.method == "GET":
        return (
            jsonify(
                {
                    "success": True,
                    "bot": chatbot.to_dict(),
                    "chats": [chat.to_dict() for chat in chats],
                }
            ),
            200,
        )

    data = request.get_json()
    query: str = data.get("query")

    chat_to_pass: List[Dict[str, str]] = [{"role": "system", "content": chatbot.prompt}]
    for chat in chats:
        chat_to_pass.append({"role": "user", "content": chat.user_query})
        chat_to_pass.append({"role": "assistant", "content": chat.response})
    chat_to_pass.append({"role": "user", "content": query})

    response: Optional[str] = chat_with_chatbot(chat_to_pass)

    if response:
        chat = Chat(
            chatbot_id=chatbot_id,
            user_id=user.id,
            user_query=query,
            response=response,
        )
        db.session.add(chat)
        db.session.commit()

        return jsonify({"success": True, "response": response})

    return (
        jsonify(
            {
                "success": False,
                "message": "Failed to get a response from the chatbot.",
            }
        ),
        500,
    )


@api_bp.route("/api/chatbot/<int:chatbot_id>/publish", methods=["POST"])
@jwt_required()
def api_publish_chatbot(chatbot_id: int) -> Union[Response, tuple[Response, int]]:
    """API endpoint to publish or unpublish a chatbot."""
    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)
    user = get_current_user()
    if chatbot.user_id != user.id:
        return (
            jsonify({"error": "Unauthorized access."}),
            403,
        )

    chatbot.public = not chatbot.public
    db.session.commit()

    message: str = (
        f"Chatbot '{chatbot.name}' is now {'published' if chatbot.public else 'unpublished'}."
    )

    return jsonify({"message": message, "public": chatbot.public}), 200


@api_bp.route("/api/profile/edit", methods=["POST"])
@jwt_required()
def api_profile_edit() -> Union[Response, tuple[Response, int]]:
    """API endpoint to edit the user's profile."""
    user = get_current_user()
    data = request.get_json()
    username: str = data.get("username")
    name: str = data.get("name")
    bio: str = data.get("bio")

    user.name = name
    user.username = username
    user.bio = bio
    try:
        db.session.commit()
        return (
            jsonify({"message": "Profile updated successfully.", "success": True}),
            200,
        )
    except IntegrityError:
        db.session.rollback()
        return (
            jsonify({"message": "Username already exists.", "success": False}),
            400,
        )


@api_bp.route("/api/anonymous", methods=["POST"])
def api_anonymous_chatbot() -> Union[Response, tuple[Response, int]]:
    """API endpoint to interact with a chatbot."""
    try:
        verify_jwt_in_request(optional=True)  # Only verify JWT if provided
        is_authenticated = current_user.is_authenticated
    except Exception:
        # If no JWT or an invalid JWT is provided, treat as anonymous
        is_authenticated = False
    if not is_authenticated:
        # Track message count for anonymous users using session
        if "anonymous_message_count" not in session:
            session["anonymous_message_count"] = 0
            session["first_message_time"] = (
                datetime.now().isoformat()
            )  # Store time of the first message

        # Increment message count
        session["anonymous_message_count"] += 1

        # Check if the limit has been reached
        if session["anonymous_message_count"] > ANONYMOUS_MESSAGE_LIMIT:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Anonymous users are limited to 5 messages.",
                    }
                ),
                429,
            )  # HTTP 429 Too Many Requests

    data = request.get_json()
    prev_chats = data.get("prev")
    query: str = data.get("query")

    chat_to_pass: List[Dict[str, str]] = []
    for chat in prev_chats:
        chat_to_pass.append({"role": "user", "content": chat["user_query"]})
        chat_to_pass.append({"role": "assistant", "content": chat["response"]})
    chat_to_pass.append({"role": "user", "content": query})

    response: Optional[str] = chat_with_chatbot(chat_to_pass)

    return jsonify(
        {
            "success": True,
            "response": response,
            "updated_chats": chat_to_pass,
        }
    )


@api_bp.route("/api/chatbot/<int:chatbot_id>/clear", methods=["POST"])
@jwt_required()
def api_clear_chats(chatbot_id: int) -> Union[Response, tuple[Response, int]]:
    """API endpoint to clear messages of a chatbot."""
    user = get_current_user()
    deleted_count = Chat.query.filter_by(
        chatbot_id=chatbot_id,
        user_id=user.id,
    ).delete()
    # Commit the changes to the database
    db.session.commit()

    return (
        jsonify(
            {
                "success": True,
                "message": f"Deleted {deleted_count} messages for chatbot ID {chatbot_id}.",
            }
        ),
        200,
    )


@api_bp.route("/api/imagine", methods=["POST", "GET"])
@jwt_required()
def api_create_image() -> Response:
    """API endpoint to create a new image."""

    user = get_current_user()
    if request.method == "GET":
        images: List[Image] = Image.query.filter_by(user_id=user.id).all()
        return jsonify(
            {"success": True, "images": [image.to_dict() for image in images]}
        )
    else:
        data = request.get_json()
        prompt: str = data.get("query")
        print(prompt, user.id)
        image: Image = Image(
            prompt=prompt,
            user_id=user.id,
        )

        db.session.add(image)
        db.session.commit()
        return jsonify({"success": True, "message": "Image created."})


@api_bp.route("/api/user_info", methods=["GET"])
@jwt_required()
def api_user_info():
    try:
        uid: int = get_jwt_identity()
        # Query the database to retrieve user details
        user = User.query.get(uid)
        if user is None:
            return jsonify({"success": False, "message": "User not found."}), 404

        return jsonify({"success": True, "user": user.to_dict()}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@api_bp.route("/api/user/<string:username>", methods=["GET"])
@jwt_required()
def api_get_user_data(username: str):
    try:
        user: Optional[User] = User.query.filter_by(username=username).first()
        if user == None:
            return jsonify({"success": False, "message": "User not found"}), 404

        num_chatbots = Chatbot.query.filter(Chatbot.user_id == user.id).count()
        num_images = Image.query.filter(Image.user_id == user.id).count()
        # Response data
        POINTS_PER_BOT = 5
        POINTS_PER_IMAGE = 1
        contribution_score = (num_chatbots * POINTS_PER_BOT) + (
            num_images * POINTS_PER_IMAGE
        )

        response = {
            "success": True,
            "user": user.to_dict(),
            "contribution_score": contribution_score,
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@api_bp.route("/api/data", methods=["GET"])
@jwt_required()
def api_get_data():
    try:
        create_default_chatbots(db)
        uid: str = get_jwt_identity()
        queues_req: str = request.args.get("queues")
        o_uid: str = request.args.get("uid")
        if queues_req:
            queues: List[str] = queues_req.split(",")
        else:
            queues = []

        # Validate queues input
        valid_queues = {
            "system_bots",
            "my_bots",
            "my_images",
            "public_bots",
            "public_images",
            "user_bots",
            "trend_today",
        }
        queues = [q for q in queues if q in valid_queues]

        # Fetch data
        chatbots: List[Chatbot] = Chatbot.query.filter(Chatbot.user_id == uid).all()
        images: List[Image] = Image.query.filter(Image.user_id == uid).all()
        system_chatbots: List[Chatbot] = Chatbot.query.filter(
            Chatbot.generated_by == "system"
        ).all()
        public_chatbots: List[Chatbot] = Chatbot.query.filter_by(public=True).all()
        public_images: List[Image] = Image.query.filter_by(public=True).all()

        response = {"success": True}

        # Build response based on queues
        if "system_bots" in queues:
            response["system_bots"] = [bot.to_dict() for bot in system_chatbots]
        if "my_bots" in queues:
            response["my_bots"] = [bot.to_dict() for bot in chatbots]
        if "my_images" in queues:
            response["my_images"] = [image.to_dict() for image in images]
        if "public_bots" in queues:
            response["public_bots"] = [bot.to_dict() for bot in public_chatbots]
        if "public_images" in queues:
            response["public_images"] = [image.to_dict() for image in public_images]
        if "user_bots" in queues:
            o_chatbots: List[Chatbot] = Chatbot.query.filter(
                Chatbot.user_id == o_uid
            ).all()
            response["user_bots"] = [bot.to_dict() for bot in o_chatbots]

        if "trend_today" in queues:
            chatbot_of_the_day: Chatbot = (
                db.session.query(Chatbot)
                .filter(Chatbot.public == True)  # Only select public chatbots
                .order_by(func.random())
                .first()
            )
            image_of_the_day: Image = (
                db.session.query(Image)
                .filter(Image.public == True)  # Only select public images
                .order_by(func.random())
                .first()
            )
            response["trend_today"] = {
                "chatbot": chatbot_of_the_day.to_dict(),
                "image": image_of_the_day.to_dict(),
            }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@api_bp.route("/api/actions/<string:obj>/<int:obj_id>/like", methods=["POST"])
def api_like(obj, obj_id):
    try:
        valid_objs = {
            "chatbot": Chatbot,
            "image": Image,
            "user": User,
        }
        # Validate the object type
        if obj not in valid_objs:
            return jsonify({"success": False, "message": "Invalid obj"}), 400

        model = valid_objs[obj]
        # Fetch the object to avoid race conditions and check if it exists
        item = db.session.query(model).filter_by(id=obj_id).first()

        if not item:
            return (
                jsonify({"success": False, "message": f"{obj.capitalize()} not found"}),
                404,
            )

        # Increment the likes in memory and then commit
        item.likes += 1

        db.session.commit()
        return (
            jsonify(
                {"success": True, "message": f"{obj.capitalize()} liked successfully!"}
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"success": False, "message": str(e)}), 500


@api_bp.route("/api/actions/<string:obj>/<int:obj_id>/report", methods=["POST"])
def api_report(obj, obj_id):
    try:
        valid_objs = {
            "chatbot",
            "image",
            "user",
        }
        if obj not in valid_objs:
            return jsonify({"success": False, "message": "Invalid obj"}), 400

        if obj == "chatbot":
            db.session.query(Chatbot).filter_by(id=obj_id).update(
                {"reports": Chatbot.reports + 1}
            )
        if obj == "user":
            db.session.query(User).filter_by(id=obj_id).update(
                {"reports": User.reports + 1}
            )
        if obj == "chatbot":
            db.session.query(Chatbot).filter_by(id=obj_id).update(
                {"reports": Chatbot.reports + 1}
            )

        db.session.commit()
        return jsonify({"success": True, "message": "Action Done!"}), 200
    except Exception as e:
        db.session.rollback()  # In case of error, rollback the transaction
        return jsonify({"success": False, "message": str(e)}), 500
