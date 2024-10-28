import logging
from sqlalchemy import func
from .models import User, Chatbot, Chat, Image
from typing import Union, List, Optional, Dict

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.FileHandler("contribution_data_fetch.log")
handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)

def fetch_contribution_data(db):
    """Fetch user data sorted by contribution score, and log details."""

    try:
        users = db.session.query(User).order_by(User.contribution_score.desc()).all()
        logger.info("Fetched user contribution data successfully.")
        return users
    except Exception as e:
        logger.error(f"Error fetching contribution data: {str(e)}")
        return []
