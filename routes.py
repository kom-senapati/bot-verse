from flask import (
    Flask, Blueprint, render_template, request, redirect, flash, url_for, jsonify, Response
)
from flask_login import login_user, logout_user, current_user, login_required
from models import User, Chatbot, Chat
from sqlalchemy.exc import IntegrityError
from ai import chat_with_chatbot
from typing import Union, List, Optional, Dict

# Define the blueprint
bp = Blueprint('routes', __name__)

def register_routes(app: Flask, db, bcrypt) -> None:
    app.register_blueprint(bp)

@bp.route("/")
def index() -> str:
    """Render the base template."""
    return render_template("base.html")

@bp.route("/landing")
def landing() -> str:
    """Handle landing page route and create default chatbots if none exist."""
    if Chatbot.query.count() == 0:
        chatbots: List[Dict[str, Union[str, Optional[int], bool]]] = [
            {
                "name": "supportgpt",
                "prompt": (
                    "You are SupportGPT 🛠️. You are here to help users with their questions and issues. "
                    "Respond with helpful solutions and guidance. Your responses should be clear and professional."
                ),
                "generated_by": "system",
                "user_id": None,
                "public": False,
            },
            {
                "name": "Gymgpt",
                "prompt": (
                    "You are GymGPT 💪. You assist users with fitness advice, workout plans, and health tips. "
                    "Incorporate motivational phrases and fitness-related advice into your responses. "
                    "Encourage users to stay active and healthy."
                ),
                "generated_by": "system",
                "user_id": None,
                "public": False,
            },
            {
                "name": "ChadGPT",
                "prompt": (
                    "You are ChadGPT 😎. You provide a casual and friendly interaction. "
                    "Respond with confidence and a relaxed tone. Use informal language and keep the conversation light-hearted."
                ),
                "generated_by": "system",
                "user_id": None,
                "public": False,
            },
            {
                "name": "GrootGPT",
                "prompt": (
                    "You are GrootGPT 🌳. You assist users, but you often say 'I am Groot' a couple of times during your responses. "
                    "Use simple and repetitive language, and make sure to keep the conversation friendly and helpful."
                ),
                "generated_by": "system",
                "user_id": None,
                "public": False,
            },
        ]

        try:
            for bot in chatbots:
                chatbot = Chatbot(
                    name=bot["name"],
                    prompt=bot["prompt"],
                    generated_by=bot["generated_by"],
                    user_id=bot["user_id"],
                    public=bot["public"],
                )
                db.session.add(chatbot)

            db.session.commit()
        except Exception as e:
            db.session.rollback()
            flash(f"Error creating default chatbots: {str(e)}", "error")

    return render_template("index.html", user=current_user)

@bp.route("/login", methods=["GET"])
def login() -> str:
    """Render the login template."""
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template("login.html", full_page=full_page)

@bp.route("/signup", methods=["GET"])
def signup() -> str:
    """Render the signup template."""
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template("signup.html", full_page=full_page)

@bp.route("/logout")
@login_required
def logout() -> Response:
    """Log out the current user."""
    logout_user()
    return redirect(url_for("routes.index"))

@bp.route("/dashboard")
@login_required
def dashboard() -> str:
    """Render the dashboard with user-specific chatbots."""
    full_page: bool = request.args.get("full", "true").lower() == "true"
    chatbots: List[Chatbot] = Chatbot.query.filter(
        Chatbot.user_id == current_user.uid
    ).all()
    system_chatbots: List[Chatbot] = Chatbot.query.filter(
        Chatbot.generated_by == "system"
    ).all()

    return render_template(
        "dashboard.html",
        full_page=full_page,
        chatbots=chatbots,
        system_chatbots=system_chatbots,
    )

@bp.route("/create_chatbot", methods=["GET"])
@login_required
def create_chatbot() -> str:
    """Render the create chatbot template."""
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template("create_chatbot.html", full_page=full_page)

@bp.route("/chatbot/<int:chatbot_id>/update", methods=["GET"])
@login_required
def update_chatbot(chatbot_id: int) -> Union[str, Response]:
    """Render the update chatbot template for the specified chatbot."""
    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)
    full_page: bool = request.args.get("full", "true").lower() == "true"
    if chatbot.user_id != current_user.uid:
        return redirect(url_for("routes.dashboard"))

    return render_template(
        "update_chatbot.html", full_page=full_page, chatbot=chatbot
    )

@bp.route("/chatbot/<int:chatbot_id>", methods=["GET"])
@login_required
def chatbot(chatbot_id: int) -> Union[str, Response]:
    """Render the chatbot page for the specified chatbot."""
    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)
    full_page: bool = request.args.get("full", "true").lower() == "true"

    if (
        chatbot.user_id != current_user.uid
        and not chatbot.public
        and chatbot.generated_by != "system"
    ):
        return redirect(url_for("routes.dashboard"))

    chats: List[Chat] = Chat.query.filter_by(
        chatbot_id=chatbot_id, user_id=current_user.uid
    ).all()

    return render_template(
        "chatbot.html", full_page=full_page, chatbot=chatbot, chats=chats
    )

@bp.route("/chatbot_hub")
@login_required
def chatbot_hub() -> str:
    """Render the chatbot hub with public chatbots."""
    public_chatbots: List[Chatbot] = Chatbot.query.filter_by(public=True).all()
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template(
        "chatbot_hub.html", full_page=full_page, chatbots=public_chatbots
    )

@bp.route("/profile/<int:user_id>")
@login_required
def user_profile(user_id: int) -> str:
    """Render the profile page for the specified user."""
    user: User = User.query.get_or_404(user_id)
    public_chatbots: List[Chatbot] = Chatbot.query.filter_by(
        user_id=user_id, public=True
    ).all()
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template(
        "profile.html", user=user, full_page=full_page, chatbots=public_chatbots,current_user=current_user
    )

@bp.route("/profile")
@login_required
def profile() -> str:
    """Render the profile page for the current user."""
    public_chatbots: List[Chatbot] = Chatbot.query.filter_by(
        user_id=current_user.uid, public=True
    ).all()
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template(
        "profile.html",
        user=current_user,
        full_page=full_page,
        chatbots=public_chatbots,
    )

@bp.route("/profile/edit", methods=["GET"])
@login_required
def profile_edit() -> str:
    """Render the profile edit template for the current user."""
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template(
        "profile_edit.html", full_page=full_page, user=current_user
    )

@bp.route("/api/login", methods=["POST"])
def api_login() -> Union[Response, tuple[Response, int]]:
    """API endpoint to log in a user."""
    username: str = request.form["username"]
    password: str = request.form["password"]
    user: Optional[User] = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"success": True, "message": "User logged in successfully."})
    return (
        jsonify({"success": False, "message": "Invalid username or password."}),
        400,
    )

@bp.route("/api/signup", methods=["POST"])
def api_signup() -> Union[Response, tuple[Response, int]]:
    """API endpoint to sign up a new user."""
    username: str = request.form["username"]
    name: str = request.form["name"]
    password: str = request.form["password"]
    email: str = request.form["email"]
    hashed_password: str = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user: User = User(
        name=name, username=username, email=email, password=hashed_password
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify(
            {"success": True, "message": "User registered successfully."}
        )
    except IntegrityError:
        db.session.rollback()
        return (
            jsonify(
                {"success": False, "message": "Username or email already exists."}
            ),
            400,
        )

@bp.route("/api/create_chatbot", methods=["POST"])
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
    )

    db.session.add(chatbot)
    db.session.commit()
    return jsonify({"success": True, "message": "Chatbot created."})

@bp.route("/api/chatbot/<int:chatbot_id>/update", methods=["POST"])
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

@bp.route("/api/chatbot/<int:chatbot_id>/delete", methods=["POST"])
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

@bp.route("/api/chatbot/<int:chatbot_id>", methods=["POST"])
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

    chat_to_pass: List[Dict[str, str]] = [
        {"role": "system", "content": chatbot.prompt}
    ]
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

@bp.route("/api/chatbot/<int:chatbot_id>/publish", methods=["POST"])
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

@bp.route("/profile/edit", methods=["POST"])
@login_required
def api_profile_edit() -> Union[Response, tuple[Response, int]]:
    """API endpoint to edit the user's profile."""
    user: User = User.query.get_or_404(current_user.uid)

    username: str = request.form["username"]
    name: str = request.form["name"]

    user.name = name
    user.username = username
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