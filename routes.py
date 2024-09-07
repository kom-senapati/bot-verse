from crypt import methods
from flask import render_template, request, redirect, flash, url_for
from flask_login import login_user, logout_user, current_user, login_required
from models import User, Chatbot, Chat
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from ai import chat_with_chatbot


def register_routes(app, db, bcrypt):
    @app.route("/")
    def index():
        return render_template("index.html", user=current_user)

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            username = request.form["username"]
            password = request.form["password"]
            user = User.query.filter_by(username=username).first()
            if user and bcrypt.check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for("dashboard"))
            flash("Invalid username or password")
        return render_template("login.html")

    @app.route("/signup", methods=["GET", "POST"])
    def signup():
        if request.method == "POST":
            username = request.form["username"]
            name = request.form["name"]
            password = request.form["password"]
            email = request.form["email"]
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
                flash("Username or email already exists")
        return render_template("signup.html")

    @app.route("/logout")
    @login_required
    def logout():
        logout_user()
        return redirect(url_for("index"))

    @app.route("/dashboard")
    @login_required
    def dashboard():
        chatbots = Chatbot.query.filter(
            (Chatbot.user_id == current_user.uid) | (Chatbot.user_id == None)
        ).all()

        return render_template("dashboard.html", current_user=current_user ,chatbots=chatbots)

    @app.route("/create_chatbot", methods=["GET", "POST"])
    @login_required
    def create_chatbot():
        if request.method == "POST":
            chatbot_name = request.form["chatbot_name"]
            chatbot_prompt = request.form["chatbot_prompt"]

            chatbot = Chatbot(
                name=chatbot_name,
                user_id=current_user.uid,
                prompt=chatbot_prompt,
                generated_by="user",
            )

            db.session.add(chatbot)
            db.session.commit()
            return redirect(url_for("dashboard"))
        
        return render_template("create_chatbot.html")

    @app.route("/chatbot/<int:chatbot_id>", methods=["GET", "POST"])
    @login_required
    def chatbot(chatbot_id):
        chatbot = Chatbot.query.get(chatbot_id)
        chats = Chat.query.filter(
            and_(Chat.chatbot_id == chatbot_id, Chat.user_id == current_user.uid)
        ).all()
        if request.method == "POST":
            query = request.form["query"]

            if not chats:
                response = chat_with_chatbot(
                    [
                        {"role": "system", "content": chatbot.prompt},
                        {"role": "user", "content": query},
                    ]
                )
            else:
                chat_to_pass = []
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
                chats.append(chat)
                db.session.add(chat)
                db.session.commit()
            
            return render_template("chatbot.html", chatbot=chatbot, chats=chats)
        
        return render_template("chatbot.html", chatbot=chatbot, chats=chats)
