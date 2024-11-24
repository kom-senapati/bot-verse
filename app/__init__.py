import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
login_manager = LoginManager()


def create_app() -> Flask:
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "sqlite:///./test.db"
    )
    app.secret_key = os.environ.get("SECRET_KEY", "default_secret_key")
    app.config["JWT_SECRET_KEY"] = os.environ.get(
        "SECRET_KEY", "default_jwt_secret_key"
    )
    app.url_map.strict_slashes = False
    # temp. condition
    # TODO: keep only jwt
    jwt = JWTManager(app)
    login_manager.init_app(app)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    CORS(app)

    from .models import User

    @login_manager.user_loader
    def load_user(uid: int) -> User:
        return User.query.get(uid)

    from .api_routes import register_api_routes
    
    register_api_routes(app, db, bcrypt)

    return app
