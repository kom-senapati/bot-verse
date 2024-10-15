import pytest
from app import create_app, db
from app.models import User


@pytest.fixture
def app():
    app = create_app()
    app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()


@pytest.fixture
def setup_user(app):
    with app.app_context():
        user = User(id=1, username="testuser", email="test@example.com")
        db.session.add(user)
        db.session.commit()

        yield user

        # db.session.delete(user)
        # db.session.commit()
