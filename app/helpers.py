from flask import flash
from .models import Chatbot
from .constants import BOT_AVATAR_API, DEFAULT_CHATBOTS
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.FileHandler("chatbot_creation.log")
handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)

def create_default_chatbots(db):
    """Create default chatbots if none exist."""
    
    if Chatbot.query.count() == 0:
        try:
            for bot_data in DEFAULT_CHATBOTS:
                required_fields = ["name", "prompt", "generated_by"]
                for field in required_fields:
                    if field not in bot_data:
                        logger.error(f"Missing required field '{field}' in bot_data: {bot_data}")
                        continue
                
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
            logger.info("Default chatbots created successfully.")
        except Exception as e:
            db.session.rollback()
            error_message = f"Error creating default chatbots: {str(e)}"
            flash(error_message, "error")
            logger.error(error_message)
