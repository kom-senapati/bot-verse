import pytest


def test_app_creation(app):
    assert app is not None
    assert app.testing


def test_home_route(client):
    response = client.get("/")
    assert response.status_code == 200
