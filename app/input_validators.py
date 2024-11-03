import re
from bleach import clean

def validate_username(username: str) -> bool:
    # Allows alphanumeric usernames with underscores, 3-15 characters
    return bool(re.match(r"^[a-zA-Z0-9_]{3,15}$", username))

def validate_password(password: str) -> bool:
    # Requires at least 8 characters, including one uppercase, one lowercase, and one number
    return bool(re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$", password))

def sanitize_input(input_value: str) -> str:
    # Cleans potentially harmful HTML tags or attributes
    return clean(input_value)
