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
from flask_login import logout_user, current_user, login_required, login_user
from werkzeug.security import check_password_hash
from datetime import timedelta
from .models import User
from .input_validators import validate_username, validate_password, sanitize_input

bp = Blueprint("routes", __name__)

@bp.route("/login", methods=["GET", "POST"])
def login() -> Union[str, Response]:
    """Handle login logic with validation and sanitization."""
    if request.method == "POST":
        # Sanitize and validate input
        username = sanitize_input(request.form["username"])
        password = request.form["password"]  # Password is hashed, so no need for sanitization

        if not (validate_username(username) and validate_password(password)):
            return redirect(url_for("routes.login", error="Invalid username or password format"))

        # Authenticate user
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            response = make_response(redirect(url_for("routes.dashboard")))
            
            # Handle "Remember me" functionality
            remember = request.form.get("remember")
            if remember:
                response.set_cookie("username", username, max_age=timedelta(days=30))
            else:
                response.set_cookie("username", "", max_age=0)

            return response
        else:
            return redirect(url_for("routes.login", error="Invalid credentials"))

    # Render login page on GET request
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template("login.html", full_page=full_page)

@bp.route("/signup", methods=["GET", "POST"])
def signup() -> Union[str, Response]:
    """Handle signup logic with validation and sanitization."""
    if request.method == "POST":
        # Sanitize and validate input
        username = sanitize_input(request.form["username"])
        password = request.form["password"]

        if not (validate_username(username) and validate_password(password)):
            return redirect(url_for("routes.signup", error="Invalid username or password format"))

        # Hash password and store user (assuming User model handles password hashing)
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, password=hashed_password)
        
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for("routes.login"))

    # Render signup page on GET request
    full_page: bool = request.args.get("full", "true").lower() == "true"
    return render_template("signup.html", full_page=full_page)
