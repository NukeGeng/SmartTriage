from fastapi.testclient import TestClient


def _register_user(
    client: TestClient,
    email: str = "student-auth@example.com",
    password: str = "12345678",
    role: str = "student",
    department: str | None = None,
) -> dict:
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Test User",
            "email": email,
            "password": password,
            "role": role,
            "department": department,
        },
    )
    assert response.status_code == 201
    return response.json()["data"]


def _login_user(client: TestClient, email: str, password: str = "12345678") -> dict:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()["data"]


def test_register_user_success(client: TestClient) -> None:
    data = _register_user(client)

    assert data["email"] == "student-auth@example.com"
    assert data["role"] == "student"
    assert "hashed_password" not in data


def test_login_success(client: TestClient) -> None:
    _register_user(client, email="student-login@example.com")

    data = _login_user(client, "student-login@example.com")

    assert data["token_type"] == "bearer"
    assert data["access_token"]
    assert data["user"]["email"] == "student-login@example.com"


def test_login_wrong_password_fail(client: TestClient) -> None:
    _register_user(client, email="student-wrong-password@example.com")

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "student-wrong-password@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json()["success"] is False
    assert response.json()["message"] == "Invalid email or password"


def test_me_endpoint_success(client: TestClient) -> None:
    _register_user(client, email="student-me@example.com")
    login_data = _login_user(client, "student-me@example.com")

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {login_data['access_token']}"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["email"] == "student-me@example.com"
