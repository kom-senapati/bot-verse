import pytest
from unittest.mock import patch
from flask_login import UserMixin


class MockUser(UserMixin):
    def __init__(self, uid):
        self.uid = uid


@pytest.fixture
def mock_current_user():
    # Patch flask_login's _get_user function to return a mocked user with UID 1
    with patch("flask_login.utils._get_user", return_value=MockUser(uid=1)):
        yield


def test_dashboard_access(client, mock_current_user):
    response = client.get("/dashboard")
    assert response.status_code == 200


def test_public_chatbots_hub(client, mock_current_user):
    response = client.get("/chatbot_hub")
    assert response.status_code == 200
