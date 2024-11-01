from flask import (
    Flask,
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    Response,
    make_response,
)
from flask_login import logout_user, current_user, login_required
from .models import User, Chatbot, Chat, Image
from typing import Union, List
from .helpers import create_default_chatbots
from .constants import IMAGE_GEN_API

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

    @app.errorhandler(404)
    def not_found(e) -> str:
        """Render 404 Page."""
        return render_template("404.html")

    @app.errorhandler(500)
    def special_exception_handler(error):
        """Render 500 Page."""
        return render_template("500.html")


@bp.route("/")
def index() -> str:
    """Render the base template."""
    return render_template("base.html")


@bp.route("/landing")
def landing() -> str:
    """Handle landing page route and create default chatbots if none exist."""
    create_default_chatbots(db)
    return render_template("index.html", user=current_user)


@bp.route("/login", methods=["GET", "POST"])
def login() -> Union[str, Response]:
    """Handle login logic and render the login template."""
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        remember = request.form.get("remember")  # Check if "Remember me" is checked

        # Authenticate user
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            # Log in the user
            login_user(user)

            # Handle "Remember me" functionality
            response = make_response(redirect(url_for("routes.dashboard")))
            if remember:
                # Set a persistent cookie for 30 days
                response.set_cookie("username", username, max_age=timedelta(days=30))
            else:
                response.set_cookie("username", "", max_age=0)  # Clear the cookie if not "Remembered"

            return response
        else:
            return redirect(url_for("routes.login", error="Invalid credentials"))

    # GET request to render the login page
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
    """Log out the current user and clear the persistent cookie if it exists."""
    logout_user()
    response = make_response(redirect(url_for("routes.index")))
    response.set_cookie("username", "", max_age=0)  # Clear the cookie on logout
    return response


@bp.route("/dashboard")
@login_required
def dashboard() -> str:
    """Render the dashboard with user-specific chatbots."""
    full_page: bool = request.args.get("full", "true").lower() == "true"
    chatbots: List[Chatbot] = Chatbot.query.filter(
        Chatbot.user_id == current_user.id
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
    if chatbot.user_id != current_user.id:
        return redirect(url_for("routes.dashboard"))

    return render_template("update_chatbot.html", full_page=full_page, chatbot=chatbot)


@bp.route("/chatbot/<int:chatbot_id>", methods=["GET"])
@login_required
def chatbot(chatbot_id: int) -> Union[str, Response]:
    """Render the chatbot page for the specified chatbot."""
    chatbot: Chatbot = Chatbot.query.get_or_404(chatbot_id)
    full_page: bool = request.args.get("full", "true").lower() == "true"

    if (
        chatbot.user_id != current_user.id
        and not chatbot.public
        and chatbot.generated_by != "system"
    ):
        return redirect(url_for("routes.dashboard"))

    chats: List[Chat] = Chat.query.filter_by(
        chatbot_id=chatbot_id, user_id=current_user.id
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


@bp.route("/imagine", methods=["GET"])
def imagine_chatbot() -> Union[str, Response]:
    """Render the chatbot page for the specified chatbot."""
    full_page: bool = request.args.get("full", "true").lower() == "true"
    images: List[Image] = Image.query.filter_by(user_id=current_user.id).all()
    base_url = IMAGE_GEN_API
    return render_template(
        "imagine.html", full_page=full_page, images=images, base_url=base_url
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
        user_id=current_user.id, public=True
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


@bp.route("/gallery")
@login_required
def image_gallery() -> str:
    """Render the gallery with public images."""
    public_images: List[Image] = Image.query.filter_by(public=True).all()
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template(
        "gallery.html",
        full_page=full_page,
        images=public_images,
        base_url=IMAGE_GEN_API,
    )


@bp.route("/settings")
@login_required
def settings() -> str:
    """Render the settings page."""
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template(
        "settings.html",
        full_page=full_page,
    )
