from flask import (
    Flask,
    Blueprint,
    request,
    redirect,
    url_for,
    jsonify,
    session,
    Response,
    make_response  
)
import json, re
from .models import User, Chatbot, Chat, Image
from sqlalchemy.exc import IntegrityError
from flask_login import login_user, current_user, login_required
from typing import Union, List, Optional, Dict
from .ai import chat_with_chatbot
from .constants import BOT_AVATAR_API, USER_AVATAR_API
from datetime import datetime
import re

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


@api_bp.route("/api/login", methods=["POST"])
def api_login() -> Union[Response, tuple[Response, int]]:
    """API endpoint to log in a user."""
    username: str = request.form["username"]
    password: str = request.form["password"]
    remember_me: bool = request.form.get("remember_me") == 'on'  # Ensure this checks if 'on'

    user: Optional[User] = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)

        # Create the response
        response = make_response(jsonify({"success": True, "message": "User logged in successfully."}))

        # Set the cookie only if 'remember_me' is checked
        if remember_me:  # Only set cookie if checkbox is checked
            response.set_cookie('username', username, max_age=30 * 24 * 60 * 60)  # 30 days
        else:
            # Optional: Clear the cookie if the checkbox is not checked
            response.set_cookie('username', '', expires=0)  # Clear the cookie

        return response

    return (
        jsonify({"success": False, "message": "Invalid username or password."}),
        400,
    )




@api_bp.route("/api/signup", methods=["POST"])
def api_signup() -> Union[Response, tuple[Response, int]]:
    """API endpoint to sign up a new user."""
    username: str = request.form["username"]
    name: str = request.form["name"]
    password: str = request.form["password"]
    email: str = request.form["email"]

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
@login_required
def api_create_chatbot() -> Response:
    """API endpoint to create a new chatbot."""
    chatbot_name: str = request.form["chatbot_name"]
    chatbot_prompt: str = request.form["chatbot_prompt"]

    chatbot: Chatbot = Chatbot(
        name=chatbot_name,
        user_id=current_user.uid,
        prompt=chatbot_prompt,
        generated_by=current_user.username,
        avatar=f"{BOT_AVATAR_API}/{chatbot_name}",
    )

    db.session.add(chatbot)
    db.session.commit()
    return jsonify({"success": True, "message": "Chatbot created."})


@api_bp.route("/api/chatbot/<int:chatbot_id>/update", methods=["POST"])
@login_required
def api_update_chatbot(chatbot_id: int) -> Union[Response, str]:
    """API endpoint to update an existing chatbot."""
    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)

    if chatbot.user_id != current_user.uid:
        return redirect(url_for("routes.dashboard"))

    chatbot.name = request.form["chatbot_name"]
    chatbot.prompt = request.form["chatbot_prompt"]

    db.session.commit()
    return jsonify({"success": True, "message": "Chatbot Updated."})


@api_bp.route("/api/chatbot/<int:chatbot_id>/delete", methods=["POST"])
@login_required
def api_delete_chatbot(chatbot_id: int) -> Union[Response, tuple[Response, int]]:
    """API endpoint to delete a chatbot."""
    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)

    if chatbot.user_id != current_user.uid:
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


@api_bp.route("/api/chatbot/<int:chatbot_id>", methods=["POST"])
@login_required
def api_chatbot(chatbot_id: int) -> Union[Response, tuple[Response, int]]:
    """API endpoint to interact with a chatbot."""
    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)

    if (
        chatbot.user_id != current_user.uid
        and not chatbot.public
        and chatbot.generated_by != "system"
    ):
        return jsonify({"success": False, "message": "Access denied."}), 403

    chats: List[Chat] = Chat.query.filter_by(
        chatbot_id=chatbot_id, user_id=current_user.uid
    ).all()

    query: str = request.form["query"]

    chat_to_pass: List[Dict[str, str]] = [{"role": "system", "content": chatbot.prompt}]
    for chat in chats:
        chat_to_pass.append({"role": "user", "content": chat.user_query})
        chat_to_pass.append({"role": "assistant", "content": chat.response})
    chat_to_pass.append({"role": "user", "content": query})

    response: Optional[str] = chat_with_chatbot(chat_to_pass)

    if response:
        chat = Chat(
            chatbot_id=chatbot_id,
            user_id=current_user.uid,
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
@login_required
def api_publish_chatbot(chatbot_id: int) -> Union[Response, tuple[Response, int]]:
    """API endpoint to publish or unpublish a chatbot."""
    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)

    if chatbot.user_id != current_user.uid:
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
@login_required
def api_profile_edit() -> Union[Response, tuple[Response, int]]:
    """API endpoint to edit the user's profile."""
    user: User = User.query.get_or_404(current_user.uid)

    username: str = request.form["username"]
    name: str = request.form["name"]
    bio: str = request.form["bio"]

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

    if not current_user.is_authenticated:
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

    prev_chats = json.loads(request.form["prev"])
    query: str = request.form["query"]

    chat_to_pass: List[Dict[str, str]] = prev_chats
    chat_to_pass.append({"role": "user", "content": query})

    response: Optional[str] = chat_with_chatbot(chat_to_pass)

    return jsonify(
        {
            "success": True,
            "response": response,
            "updated_chats": chat_to_pass,
        }
    )


@api_bp.route("/api/chat/<int:chat_id>/delete", methods=["POST"])
@login_required
def api_chat_delete(chat_id: int) -> Union[Response, tuple[Response, int]]:
    chat: Chat = Chat.query.get_or_404(chat_id)
    if chat.user_id != current_user.uid:
        return (
            jsonify({"error": "Unauthorized access."}),
            403,
        )
    chat.query.filter_by(id=chat_id).delete()
    return (
        jsonify(
            {"success": True, "message": "Message deleted.", "chat": chat.chatbot_id}
        ),
        200,
    )


@api_bp.route("/api/chatbot/<int:chatbot_id>/clear", methods=["POST"])
@login_required
def api_clear_chats(chatbot_id: int) -> Union[Response, tuple[Response, int]]:
    """API endpoint to clear messages of a chatbot."""

    deleted_count = Chat.query.filter_by(
        chatbot_id=chatbot_id,
        user_id=current_user.uid,
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


@api_bp.route("/api/create_image", methods=["POST"])
@login_required
def api_create_image() -> Response:
    """API endpoint to create a new image."""
    prompt: str = request.form["prompt"]

    image: Image = Image(
        prompt=prompt,
        user_id=current_user.uid,
    )

    db.session.add(image)
    db.session.commit()
    return jsonify({"success": True, "message": "Image created."})


# Atomic update for Image likes
@api_bp.route("/api/image/<int:image_id>/like", methods=["POST"])
def api_like_image(image_id):
    try:
        # Atomically increment likes
        db.session.query(Image).filter_by(id=image_id).update(
            {"likes": Image.likes + 1}
        )
        db.session.commit()
        return (
            jsonify({"success": True, "message": "Image liked successfully"}),
            200,
        )
    except Exception as e:
        db.session.rollback()  # In case of error, rollback the transaction
        return jsonify({"success": False, "message": str(e)}), 500


@api_bp.route("/api/image/<int:image_id>/report", methods=["POST"])
def api_report_image(image_id):
    try:
        db.session.query(Image).filter_by(id=image_id).update(
            {"reports": Image.reports + 1}
        )
        db.session.commit()
        return (
            jsonify({"success": True, "message": "Image reported successfully"}),
            200,
        )
    except Exception as e:
        db.session.rollback()  # In case of error, rollback the transaction
        return jsonify({"success": False, "message": str(e)}), 500


@api_bp.route("/api/chatbot/<int:chatbot_id>/like", methods=["POST"])
def api_like_chatbot(chatbot_id):
    try:
        # Atomically increment reports
        db.session.query(Chatbot).filter_by(id=chatbot_id).update(
            {"likes": Chatbot.likes + 1}
        )
        db.session.commit()
        return (
            jsonify({"success": True, "message": "Chatbot liked successfully"}),
            200,
        )
    except Exception as e:
        db.session.rollback()  # In case of error, rollback the transaction
        return jsonify({"success": False, "message": str(e)}), 500


@api_bp.route("/api/chatbot/<int:chatbot_id>/report", methods=["POST"])
def api_report_chatbot(chatbot_id):
    try:
        # Atomically increment reports
        db.session.query(Chatbot).filter_by(id=chatbot_id).update(
            {"reports": Chatbot.reports + 1}
        )
        db.session.commit()
        return (
            jsonify({"success": True, "message": "Chatbot reported successfully"}),
            200,
        )
    except Exception as e:
        db.session.rollback()  # In case of error, rollback the transaction
        return jsonify({"success": False, "message": str(e)}), 500
