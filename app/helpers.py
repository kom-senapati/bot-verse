from flask import flash
from .models import Chatbot
from .constants import BOT_AVATAR_API, DEFAULT_CHATBOTS
import logging

# Setup logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.FileHandler("chatbot_creation.log")
handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

def create_default_chatbots(db) -> None:
    """Create default chatbots if none exist in the database.

    This function checks if there are any chatbots in the database.
    If none exist, it creates default chatbots defined in the
    DEFAULT_CHATBOTS constant and logs the process.

    Args:
        db: The database session object.
    """
    try:
        if Chatbot.query.count() == 0:
            for bot_data in DEFAULT_CHATBOTS:
                avatar = f"{BOT_AVATAR_API}/{bot_data['name']}"
                chatbot = Chatbot(
                    public=True,  # Set to True as per your requirements
                    category="General",  # Default category if not specified
                    likes=0,  # Initialize likes
                    reports=0,  # Initialize reports
                    avatar=avatar,
                    user_id=None,
                )

                db.session.add(chatbot)

                # Create an initial version for the chatbot
                chatbot.create_version(
                    name=bot_data["name"],
                    new_prompt=bot_data["prompt"],
                    modified_by=bot_data["generated_by"],
                )

                logger.info(f"Created chatbot: {bot_data['name']}")

            db.session.commit()
            logger.info("Default chatbots and their initial versions created successfully.")
    except Exception as e:
        db.session.rollback()
        error_message = f"Error creating default chatbots: {str(e)}"
        flash(error_message, "error")
        logger.error(error_message)
