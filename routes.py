from flask import render_template, request, redirect, flash, url_for
from flask_login import login_user, logout_user, current_user, login_required
from models import User, Chatbot, Chat
from sqlalchemy.exc import IntegrityError
from ai import chat_with_chatbot
import bleach  # Importing bleach for sanitizing inputs
import re  # For regular expressions to validate inputs

def validate_username(username):
    return re.match(r'^[a-zA-Z0-9_]+$', username) is not None

def validate_email(email):
    return re.match(r'^[^@]+@[^@]+\.[^@]+$', email) is not None

def validate_password(password):
    return len(password) >= 6  # Ensure password length is at least 6 characters

def register_routes(app, db, bcrypt):
    @app.route("/")
    def index():
        # (Unchanged index function)
        ...

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            username = request.form["username"]
            password = request.form["password"]
            
            # Input validation
            if not validate_username(username):
                flash("Invalid username format.", "login-error")
                return render_template("login.html")
            
            user = User.query.filter_by(username=username).first()
            if user and bcrypt.check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for("dashboard"))
            flash("Invalid username or password.", "login-error")
        return render_template("login.html")

    @app.route("/signup", methods=["GET", "POST"])
    def signup():
        if request.method == "POST":
            username = request.form["username"]
            name = request.form["name"]
            password = request.form["password"]
            email = request.form["email"]
            
            # Validate inputs
            if not (validate_username(username) and validate_email(email) and validate_password(password)):
                flash("Invalid input data. Ensure username, email, and password are valid.", "signup-error")
                return render_template("signup.html")
            
            hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
            new_user = User(
                name=name, username=username, email=email, password=hashed_password
            )
            try:
                db.session.add(new_user)
                db.session.commit()
                return redirect(url_for("login"))
            except IntegrityError:
                db.session.rollback()
                flash("Username or email already exists.", "signup-error")

        return render_template("signup.html")

    @app.route("/create_chatbot", methods=["GET", "POST"])
    @login_required
    def create_chatbot():
        if request.method == "POST":
            chatbot_name = request.form["chatbot_name"]
            chatbot_prompt = request.form["chatbot_prompt"]

            # Sanitize inputs to prevent XSS
            chatbot_name = bleach.clean(chatbot_name)
            chatbot_prompt = bleach.clean(chatbot_prompt)

            chatbot = Chatbot(
                name=chatbot_name,
                user_id=current_user.uid,
                prompt=chatbot_prompt,
                generated_by=current_user.username,
            )

            db.session.add(chatbot)
            db.session.commit()
            return redirect(url_for("dashboard"))

        return render_template("create_chatbot.html")

    @app.route("/chatbot/<int:chatbot_id>", methods=["GET", "POST"])
    @login_required
    def chatbot(chatbot_id):
        chatbot = Chatbot.query.get_or_404(chatbot_id)

        if chatbot.user_id != current_user.uid and not chatbot.public and chatbot.generated_by != "system":
            return redirect(url_for("dashboard"))

        chats = Chat.query.filter_by(
            chatbot_id=chatbot_id, user_id=current_user.uid
        ).all()

        if request.method == "POST":
            query = request.form["query"]
            
            # Sanitize user query
            query = bleach.clean(query)

            chat_to_pass = [{"role": "system", "content": chatbot.prompt}]
            for chat in chats:
                chat_to_pass.append({"role": "user", "content": chat.user_query})
                chat_to_pass.append({"role": "assistant", "content": chat.response})
            chat_to_pass.append({"role": "user", "content": query})

            response = chat_with_chatbot(chat_to_pass)

            if response:
                chat = Chat(
                    chatbot_id=chatbot_id,
                    user_id=current_user.uid,
                    user_query=query,
                    response=response,
                )
                db.session.add(chat)
                db.session.commit()

            return redirect(url_for("chatbot", chatbot_id=chatbot_id))

        return render_template("chatbot.html", chatbot=chatbot, chats=chats)

            return redirect(url_for("chatbot", chatbot_id=chatbot_id))

        return render_template("chatbot.html", chatbot=chatbot, chats=chats)
