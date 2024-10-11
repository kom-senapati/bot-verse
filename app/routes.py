from flask import (
    Flask,
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    Response,
)
from flask_login import logout_user, current_user, login_required
from .models import User, Chatbot, Chat
from typing import Union, List
from .helpers import create_default_chatbots

# Define the blueprint
bp = Blueprint("routes", __name__)

# Initialize variables for db and bcrypt
db = None
bcrypt = None


def register_routes(app: Flask, database, bcrypt_instance) -> None:
    global db, bcrypt
    db = database
    bcrypt = bcrypt_instance
    app.register_blueprint(bp)


@bp.route("/")
def index() -> str:
    """Render the base template."""
    return render_template("base.html")


@bp.route("/landing")
def landing() -> str:
    """Handle landing page route and create default chatbots if none exist."""
    create_default_chatbots(db)
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

    return render_template("update_chatbot.html", full_page=full_page, chatbot=chatbot)


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


@bp.route("/anonymous", methods=["GET"])
def anonymous_chatbot() -> Union[str, Response]:
    """Render the chatbot page for the specified chatbot."""
    full_page: bool = request.args.get("full", "true").lower() == "true"
    is_logged_in: bool = current_user.is_authenticated
    return render_template(
        "anonymous.html", full_page=full_page, is_logged_in=is_logged_in
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
        "profile.html",
        user=user,
        full_page=full_page,
        chatbots=public_chatbots,
        current_user=current_user,
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
    return render_template("profile_edit.html", full_page=full_page, user=current_user)