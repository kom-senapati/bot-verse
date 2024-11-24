from flask import flash
from .models import Chatbot
from .constants import BOT_AVATAR_API, DEFAULT_CHATBOTS
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.FileHandler("chatbot_creation.log")
handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)


def create_default_chatbots(db):
    """Create default chatbots if none exist."""
    try:
        if Chatbot.query.count() == 0:
            for bot_data in DEFAULT_CHATBOTS:
                avatar = f"{BOT_AVATAR_API}/{bot_data['name']}"
                chatbot = Chatbot(
                    public=True,
                    category="General",
                    likes=0,
                    reports=0,
                    avatar=avatar,
                    user_id=None,
                )

                db.session.add(chatbot)
                db.session.flush()

                chatbot.create_version(
                    name=bot_data["name"],
                    new_prompt=bot_data["prompt"],
                    modified_by=bot_data["generated_by"],
                )

            db.session.commit()
            logger.info(
                "Default chatbots and their initial versions created successfully."
            )
    except Exception as e:
        db.session.rollback()
        error_message = f"Error creating default chatbots: {str(e)}"
        flash(error_message, "error")
        logger.error(error_message)
