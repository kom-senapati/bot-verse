import logging
from sqlalchemy import func
from .models import User
from typing import List

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.FileHandler("contribution_data_fetch.log")
handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)

def fetch_contribution_data(db) -> List[User]:
    """Fetch user data sorted by contribution score.

    This function retrieves users from the database and sorts them by
    their contribution score in descending order. It logs the success
    or failure of the fetch operation.

    Args:
        db: The database session object.

    Returns:
        List[User]: A list of User objects sorted by contribution score.
    """
    try:
        users = db.session.query(User).order_by(User.contribution_score.desc()).all()
        logger.info(f"Fetched {len(users)} user contribution data successfully.")
        return users
    except Exception as e:
        logger.error(f"Error fetching contribution data: {str(e)}")
        return []
