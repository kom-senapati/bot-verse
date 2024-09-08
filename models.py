from flask_login import UserMixin
from app import db


class User(db.Model, UserMixin):
    __tablename__ = "users"

    uid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    username = db.Column(db.Text, nullable=False, unique=True)
    email = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<User: {self.username}>"

    @property
    def id(self):
        return self.uid


class Chatbot(db.Model):
    __tablename__ = "chatbots"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    prompt = db.Column(db.Text, nullable=False)
    generated_by = db.Column(db.String(10), nullable=False)
    user_id = db.Column(db.Integer, nullable=True)
    public = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<Chatbot: \nName: {self.name}\nPrompt: {self.prompt}>"


class Chat(db.Model):
    __tablename__ = "chats"

    id = db.Column(db.Integer, primary_key=True)
    chatbot_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    user_query = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<Chat: \nQuery: {self.user_query}\nResponse: {self.response}>"
