from sqlalchemy import func
from .models import User, Chatbot, Chat, Image
from typing import Union, List, Optional, Dict


def fetch_contribution_data(db):
    users = db.session.query(User).order_by(User.contribution_score.desc()).all()
    return users
