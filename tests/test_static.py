def test_static_files_served(client):
    response = client.get("/static/css/styles.css")
    assert response.status_code == 200

    response = client.get("/static/js/app.js")
    assert response.status_code == 200
