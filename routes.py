from flask import render_template, request, redirect, flash, url_for
from flask_login import login_user, logout_user, current_user, login_required
from models import User, Chatbot, Chat
from sqlalchemy.exc import IntegrityError
from ai import chat_with_chatbot


def register_routes(app, db, bcrypt):
    @app.route("/")
    def index():
        if Chatbot.query.count() == 0:
            chatbots = [
                {
                    "name": "supportgpt",
                    "prompt": ("You are SupportGPT 🛠️. You are here to help users with their questions and issues. "
                               "Respond with helpful solutions and guidance. Your responses should be clear and professional."),
                    "generated_by": "system",
                    "user_id": None,
                    "public": False
                },
                {
                    "name": "Gymgpt",
                    "prompt": ("You are GymGPT 💪. You assist users with fitness advice, workout plans, and health tips. "
                               "Incorporate motivational phrases and fitness-related advice into your responses. "
                               "Encourage users to stay active and healthy."),
                    "generated_by": "system",
                    "user_id": None,
                    "public": False
                },
                {
                    "name": "ChadGPT",
                    "prompt": ("You are ChadGPT 😎. You provide a casual and friendly interaction. "
                               "Respond with confidence and a relaxed tone. Use informal language and keep the conversation light-hearted."),
                    "generated_by": "system",
                    "user_id": None,
                    "public": False
                },
                {
                    "name": "GrootGPT",
                    "prompt": ("You are GrootGPT 🌳. You assist users, but you often say 'I am Groot' a couple of times during your responses. "
                               "Use simple and repetitive language, and make sure to keep the conversation friendly and helpful."),
                    "generated_by": "system",
                    "user_id": None,
                    "public": False
                }
            ]

            for bot in chatbots:
                chatbot = Chatbot(
                    name=bot["name"],
                    prompt=bot["prompt"],
                    generated_by=bot["generated_by"],
                    user_id=bot["user_id"],
                    public=bot["public"]
                )
                db.session.add(chatbot)

            db.session.commit()

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
            flash("Invalid username or password.","login-error")
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
                flash("Username or email already exists.","signup-error")

        return render_template("signup.html")

    @app.route("/logout")
    @login_required
    def logout():
        logout_user()
        return redirect(url_for("index"))

    @app.route("/dashboard")
    @login_required
    def dashboard():
        chatbots = Chatbot.query.filter((Chatbot.user_id == current_user.uid)).all()

        system_chatbots = Chatbot.query.filter(Chatbot.generated_by == "system").all()

        return render_template(
            "dashboard.html",
            current_user=current_user,
            chatbots=chatbots,
            system_chatbots=system_chatbots,
        )

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
                generated_by=current_user.username,
            )

            db.session.add(chatbot)
            db.session.commit()
            return redirect(url_for("dashboard"))

        return render_template("create_chatbot.html")

    @app.route("/chatbot/<int:chatbot_id>/update", methods=["GET", "POST"])
    @login_required
    def update_chatbot(chatbot_id):
        chatbot = Chatbot.query.get_or_404(chatbot_id)

        if chatbot.user_id != current_user.uid:
            return redirect(url_for("dashboard"))

        if request.method == "POST":
            chatbot.name = request.form["chatbot_name"]
            chatbot.prompt = request.form["chatbot_prompt"]

            db.session.commit()
            return redirect(url_for("dashboard"))

        return render_template("update_chatbot.html", chatbot=chatbot)

    @app.route("/chatbot/<int:chatbot_id>/delete", methods=["POST"])
    @login_required
    def delete_chatbot(chatbot_id):
        chatbot = Chatbot.query.get_or_404(chatbot_id)

        if chatbot.user_id != current_user.uid:
            return redirect(url_for("dashboard"))

        db.session.delete(chatbot)
        db.session.commit()

        return redirect(url_for("dashboard"))

    @app.route("/chatbot/<int:chatbot_id>/publish", methods=["POST"])
    @login_required
    def publish_chatbot(chatbot_id):
        chatbot = Chatbot.query.get_or_404(chatbot_id)

        if chatbot.user_id != current_user.uid:
            return redirect(url_for("dashboard"))

        chatbot.public = not chatbot.public
        db.session.commit()

        if chatbot.public:
            flash(f"Chatbot '{chatbot.name}' is now published.")
        else:
            flash(f"Chatbot '{chatbot.name}' is now unpublished.")

        return redirect(url_for("dashboard"))

    @app.route("/chatbot_hub")
    @login_required
    def chatbot_hub():
        public_chatbots = Chatbot.query.filter_by(public=True).all()
        return render_template("chatbot_hub.html", chatbots=public_chatbots)

    @app.route("/profile")
    @login_required
    def profile():
        public_chatbots = Chatbot.query.filter_by(
            user_id=current_user.uid, public=True
        ).all()

        return render_template(
            "profile.html", user=current_user, chatbots=public_chatbots
        )

    @app.route("/profile/edit", methods=["GET", "POST"])
    @login_required
    def profile_edit():
        user = User.query.get_or_404(current_user.uid)

        if request.method == "POST":
            username = request.form["username"]
            name = request.form["name"]

            user.name = name
            user.username = username
            try:
                db.session.commit()
                return redirect(url_for("profile"))
            except IntegrityError:
                db.session.rollback()
                flash("Username already exists.","profile-edit-error")

        return render_template(
            "profile_edit.html", user=current_user
        )

    @app.route("/profile/<int:user_id>")
    @login_required
    def user_profile(user_id):
        user = User.query.get_or_404(user_id)
        public_chatbots = Chatbot.query.filter_by(user_id=user_id, public=True).all()

        return render_template("profile.html", user=user, chatbots=public_chatbots)

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
