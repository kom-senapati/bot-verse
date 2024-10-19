from flask_login import UserMixin
from app import db


class User(db.Model, UserMixin):
    __tablename__ = "users"

    uid: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.Text, nullable=False)
    avatar: str = db.Column(db.Text, nullable=False)
    bio: str = db.Column(db.Text, nullable=False)
    username: str = db.Column(db.Text, nullable=False, unique=True)
    email: str = db.Column(db.Text, nullable=False, unique=True)
    password: str = db.Column(db.Text, nullable=False)

    def __repr__(self) -> str:
        return f"<User: {self.username}>"

    @property
    def id(self) -> int:
        return self.uid


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
