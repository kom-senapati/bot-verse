import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from jinjaMarkdown.markdownExtension import markdownExtension
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
login_manager = LoginManager()
jwt = JWTManager()  # Move JWTManager initialization outside of the create_app function

def create_app() -> Flask:
    app = Flask(__name__, template_folder="templates", static_folder="static")
    
    # Load configurations from environment variables
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "sqlite:///./test.db"
    )
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "default_secret_key")
    app.config["JWT_SECRET_KEY"] = os.environ.get(
        "JWT_SECRET_KEY", "default_jwt_secret_key"
    )
    app.url_map.strict_slashes = False
    app.jinja_env.add_extension(markdownExtension)
    
    # Initialize extensions with the app context
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    jwt.init_app(app)  # Initialize JWTManager here
    CORS(app)

    from .models import User

    @login_manager.user_loader
    def load_user(uid: int) -> User:
        return User.query.get(uid)

    # Register routes
    from .routes import register_routes
    from .api_routes import register_api_routes

    register_routes(app, db, bcrypt)
    register_api_routes(app, db, bcrypt)

    return app
