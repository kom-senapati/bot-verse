from flask import flash
from .models import Chatbot
from .constants import BOT_AVATAR_API, DEFAULT_CHATBOTS


def create_default_chatbots(db):
    """Create default chatbots if none exist."""

    if Chatbot.query.count() == 0:
        try:
            for bot_data in DEFAULT_CHATBOTS:
                avatar = f"{BOT_AVATAR_API}/{bot_data['name']}"
                chatbot = Chatbot(
                    name=bot_data["name"],
                    prompt=bot_data["prompt"],
                    generated_by=bot_data["generated_by"],
                    user_id=bot_data["user_id"],
                    avatar=avatar,
                    public=True,
                )
                db.session.add(chatbot)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            flash(f"Error creating default chatbots: {str(e)}", "error")
