from flask import render_template, request, redirect, flash, url_for, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from .models import User, Chatbot, Chat
from sqlalchemy.exc import IntegrityError
from .ai import chat_with_chatbot


def register_routes(app, db, bcrypt):
    @app.route("/")
    def index():
        return render_template("base.html")

    @app.route("/landing")
    def landing():
        if Chatbot.query.count() == 0:
            chatbots = [
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

        return render_template("index.html", user=current_user)

    @app.route("/login", methods=["GET"])
    def login():
        # Check if the request is for a full page
        full_page = request.args.get("full", "true").lower() == "true"
        return render_template("login.html", full_page=full_page)

    @app.route("/signup", methods=["GET"])
    def signup():
        # Check if the request is for a full page
        full_page = request.args.get("full", "true").lower() == "true"

        return render_template("signup.html", full_page=full_page)

    @app.route("/logout")
    @login_required
    def logout():
        logout_user()
        return redirect(url_for("index"))

    @app.route("/dashboard")
    @login_required
    def dashboard():
        full_page = request.args.get("full", "true").lower() == "true"
        chatbots = Chatbot.query.filter((Chatbot.user_id == current_user.uid)).all()
        system_chatbots = Chatbot.query.filter(Chatbot.generated_by == "system").all()

        return render_template(
            "dashboard.html",
            full_page=full_page,
            chatbots=chatbots,
            system_chatbots=system_chatbots,
        )

    @app.route("/create_chatbot", methods=["GET"])
    @login_required
    def create_chatbot():
        full_page = request.args.get("full", "true").lower() == "true"

        return render_template("create_chatbot.html", full_page=full_page)

    @app.route("/chatbot/<int:chatbot_id>/update", methods=["GET"])
    @login_required
    def update_chatbot(chatbot_id):
        chatbot = Chatbot.query.get_or_404(chatbot_id)
        full_page = request.args.get("full", "true").lower() == "true"
        if chatbot.user_id != current_user.uid:
            return redirect(url_for("dashboard"))

        return render_template(
            "update_chatbot.html", full_page=full_page, chatbot=chatbot
        )

    @app.route("/chatbot/<int:chatbot_id>", methods=["GET"])
    @login_required
    def chatbot(chatbot_id):
        chatbot = Chatbot.query.get_or_404(chatbot_id)
        full_page = request.args.get("full", "true").lower() == "true"

        if (
            chatbot.user_id != current_user.uid
            and not chatbot.public
            and chatbot.generated_by != "system"
        ):
            return redirect(url_for("dashboard"))

        chats = Chat.query.filter_by(
            chatbot_id=chatbot_id, user_id=current_user.uid
        ).all()

        return render_template(
            "chatbot.html", full_page=full_page, chatbot=chatbot, chats=chats
        )

    @app.route("/chatbot_hub")
    @login_required
    def chatbot_hub():
        public_chatbots = Chatbot.query.filter_by(public=True).all()
        full_page = request.args.get("full", "true").lower() == "true"
        return render_template(
            "chatbot_hub.html", full_page=full_page, chatbots=public_chatbots
        )

    @app.route("/profile/<int:user_id>")
    @login_required
    def user_profile(user_id):
        user = User.query.get_or_404(user_id)
        public_chatbots = Chatbot.query.filter_by(user_id=user_id, public=True).all()
        full_page = request.args.get("full", "true").lower() == "true"
        return render_template(
            "profile.html", user=user, full_page=full_page, chatbots=public_chatbots
        )

    @app.route("/profile")
    @login_required
    def profile():
        public_chatbots = Chatbot.query.filter_by(
            user_id=current_user.uid, public=True
        ).all()
        full_page = request.args.get("full", "true").lower() == "true"
        return render_template(
            "profile.html",
            user=current_user,
            full_page=full_page,
            chatbots=public_chatbots,
        )

    @app.route("/profile/edit", methods=["GET"])
    @login_required
    def profile_edit():
        full_page = request.args.get("full", "true").lower() == "true"
        return render_template(
            "profile_edit.html", full_page=full_page, user=current_user
        )

    @app.route("/api/login", methods=["POST"])
    def api_login():
        username = request.form["username"]
        password = request.form["password"]
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return jsonify({"success": True, "message": "User logged In successfully."})
        return (
            jsonify({"success": False, "message": "Invalid username or password."}),
            400,
        )

    @app.route("/api/signup", methods=["POST"])
    def api_signup():
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

    @app.route("/api/create_chatbot", methods=["POST"])
    @login_required
    def api_create_chatbot():
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
        return jsonify({"success": True, "message": "Chatbot created."})

    @app.route("/api/chatbot/<int:chatbot_id>/update", methods=["POST"])
    @login_required
    def api_update_chatbot(chatbot_id):
        chatbot = Chatbot.query.get_or_404(chatbot_id)

        if chatbot.user_id != current_user.uid:
            return redirect(url_for("dashboard"))

        chatbot.name = request.form["chatbot_name"]
        chatbot.prompt = request.form["chatbot_prompt"]

        db.session.commit()
        return jsonify({"success": True, "message": "Chatbot Updated."})

    @app.route("/api/chatbot/<int:chatbot_id>/delete", methods=["POST"])
    @login_required
    def api_delete_chatbot(chatbot_id):
        chatbot = Chatbot.query.get_or_404(chatbot_id)

        if chatbot.user_id != current_user.uid:
            return (
                jsonify({"error": "Unauthorized access."}),
                403,
            )  # Return an error response for unauthorized access

        db.session.delete(chatbot)
        db.session.commit()

        # Return a JSON response confirming deletion
        return (
            jsonify(
                {"message": f"Chatbot '{chatbot.name}' has been deleted successfully."}
            ),
            200,
        )

    @app.route("/api/chatbot/<int:chatbot_id>", methods=["POST"])
    @login_required
    def api_chatbot(chatbot_id):
        # Get the specific chatbot by ID or return 404 if not found
        chatbot = Chatbot.query.get_or_404(chatbot_id)

        # Check if the current user has access to the chatbot
        if (
            chatbot.user_id != current_user.uid
            and not chatbot.public
            and chatbot.generated_by != "system"
        ):
            return jsonify({"success": False, "message": "Access denied."}), 403

        # Retrieve the previous chats for the user and the selected chatbot
        chats = Chat.query.filter_by(
            chatbot_id=chatbot_id, user_id=current_user.uid
        ).all()

        # Get the user's query from the form data
        query = request.form["query"]

        # Prepare the chat history to pass to the chatbot function
        chat_to_pass = [{"role": "system", "content": chatbot.prompt}]
        for chat in chats:
            chat_to_pass.append({"role": "user", "content": chat.user_query})
            chat_to_pass.append({"role": "assistant", "content": chat.response})
        chat_to_pass.append({"role": "user", "content": query})

        # Get the response from the chatbot
        response = chat_with_chatbot(chat_to_pass)

        if response:
            # Save the chat history to the database
            chat = Chat(
                chatbot_id=chatbot_id,
                user_id=current_user.uid,
                user_query=query,
                response=response,
            )
            db.session.add(chat)
            db.session.commit()

            # Return the response as JSON
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

    @app.route("/api/chatbot/<int:chatbot_id>/publish", methods=["POST"])
    @login_required
    def api_publish_chatbot(chatbot_id):
        chatbot = Chatbot.query.get_or_404(chatbot_id)

        if chatbot.user_id != current_user.uid:
            return (
                jsonify({"error": "Unauthorized access."}),
                403,
            )  # Return an error response for unauthorized access

        chatbot.public = not chatbot.public
        db.session.commit()

        if chatbot.public:
            message = f"Chatbot '{chatbot.name}' is now published."
        else:
            message = f"Chatbot '{chatbot.name}' is now unpublished."

        # Return a JSON response with the updated status
        return jsonify({"message": message, "public": chatbot.public}), 200

    @app.route("/profile/edit", methods=["POST"])
    @login_required
    def api_profile_edit():
        user = User.query.get_or_404(current_user.uid)

        username = request.form["username"]
        name = request.form["name"]

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
