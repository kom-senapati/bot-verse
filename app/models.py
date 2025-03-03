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
    avatar: str = db.Column(db.Text, nullable=False)
    user_id: int = db.Column(db.Integer, nullable=True)
    public: bool = db.Column(db.Boolean, default=False)
    category = db.Column(db.Text, default="General", nullable=False)
    likes: int = db.Column(db.Integer, default=0, nullable=False)
    reports: int = db.Column(db.Integer, default=0, nullable=False)
    # Linking to the latest version
    latest_version_id = db.Column(
        db.Integer, db.ForeignKey("chatbot_versions.id"), nullable=True
    )
    latest_version = db.relationship(
        "ChatbotVersion", backref="chatbot", foreign_keys=[latest_version_id]
    )

    def create_version(self, name, new_prompt, modified_by):
        version = ChatbotVersion(
            chatbot_id=self.id,
            version_number=(
                (self.latest_version.version_number + 1) if self.latest_version else 1
            ),
            name=name,
            prompt=new_prompt,
            modified_by=modified_by,
        )
        db.session.add(version)
        db.session.flush()  # Get the ID of the new version
        self.latest_version_id = version.id
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "public": self.public,
            "category": self.category,
            "user_id": self.user_id,
            "likes": self.likes,
            "avatar": self.avatar,  # Include avatar in the dictionary
            "reports": self.reports,
            "latest_version": (
                self.latest_version.to_dict() if self.latest_version else None
            ),
        }


class ChatbotVersion(db.Model):
    __tablename__ = "chatbot_versions"

    id = db.Column(db.Integer, primary_key=True)
    chatbot_id = db.Column(db.Integer, db.ForeignKey("chatbots.id"), nullable=False)
    version_number = db.Column(db.Integer, nullable=False)
    prompt = db.Column(db.Text, nullable=False)
    name = db.Column(db.String(100), nullable=False)  # Added field for name
    modified_by = db.Column(db.String(100), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "chatbot_id": self.chatbot_id,
            "version_number": self.version_number,
            "prompt": self.prompt,
            "name": self.name,  # Include name in the dictionary
            "modified_by": self.modified_by,
            "created_at": self.created_at.isoformat(),
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
    likes: int = db.Column(db.Integer, default=0, nullable=False)
    reports: int = db.Column(db.Integer, default=0, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "message": self.message,
            "chatbot_id": self.chatbot_id,
            "likes": self.likes,
            "reports": self.reports,
        }
