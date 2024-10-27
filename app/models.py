from flask_login import UserMixin
from app import db
from sqlalchemy.sql import func


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.Text, nullable=False)
    avatar: str = db.Column(db.Text, nullable=False)
    bio: str = db.Column(db.Text, nullable=False)
    username: str = db.Column(db.Text, nullable=False, unique=True)
    email: str = db.Column(db.Text, nullable=False, unique=True)
    password: str = db.Column(db.Text, nullable=False)

    likes: int = db.Column(db.Integer, default=0, nullable=False)
    reports: int = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    contribution_score: int = db.Column(db.Integer, default=0, nullable=False)

    def __repr__(self) -> str:
        return f"<User: {self.username}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "avatar": self.avatar,
            "bio": self.bio,
            "username": self.username,
            "email": self.email,
            "likes": self.likes,
            "reports": self.reports,
            "contribution_score": self.contribution_score,
            "created_at": self.created_at.isoformat(),
        }


class Chatbot(db.Model):
    __tablename__ = "chatbots"

    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(100), nullable=False)
    avatar: str = db.Column(db.Text, nullable=False)
    prompt: str = db.Column(db.Text, nullable=False)
    generated_by: str = db.Column(db.String(10), nullable=False)
    user_id: int = db.Column(db.Integer, nullable=True)
    public: bool = db.Column(db.Boolean, default=False)

    likes: int = db.Column(db.Integer, default=0, nullable=False)
    reports: int = db.Column(db.Integer, default=0, nullable=False)

    def __repr__(self) -> str:
        return f"<Chatbot: \nName: {self.name}\nPrompt: {self.prompt}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "avatar": self.avatar,
            "prompt": self.prompt,
            "public": self.public,
            "user_id": self.user_id,
            "generated_by": self.generated_by,
            "likes": self.likes,
            "reports": self.reports,
        }


class Chat(db.Model):
    __tablename__ = "chats"

    id: int = db.Column(db.Integer, primary_key=True)
    chatbot_id: int = db.Column(db.Integer, nullable=False)
    user_id: int = db.Column(db.Integer, nullable=False)
    user_query: str = db.Column(db.Text, nullable=False)
    response: str = db.Column(db.Text, nullable=False)

    def __repr__(self) -> str:
        return f"<Chat: \nQuery: {self.user_query}\nResponse: {self.response}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "chatbot_id": self.chatbot_id,
            "user_id": self.user_id,
            "user_query": self.user_query,
            "response": self.response,
        }


class Image(db.Model):
    __tablename__ = "images"

    id: int = db.Column(db.Integer, primary_key=True)
    prompt: str = db.Column(db.Text, nullable=False)
    user_id: int = db.Column(db.Integer, nullable=False)
    public: bool = db.Column(db.Boolean, default=True)
    likes: int = db.Column(db.Integer, default=0, nullable=False)
    reports: int = db.Column(db.Integer, default=0, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "prompt": self.prompt,
            "public": self.public,
            "user_id": self.user_id,
            "likes": self.likes,
            "reports": self.reports,
        }


class Comment(db.Model):
    __tablename__ = "comments"

    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.Text, nullable=False)
    message: str = db.Column(db.Text, nullable=False)
    chatbot_id: int = db.Column(db.Integer, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "message": self.message,
            "chatbot_id": self.chatbot_id,
        }
