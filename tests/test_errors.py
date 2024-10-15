from flask import url_for


def test_404_page(client):
    response = client.get("/nonexistent-page")
    assert response.status_code == 404
