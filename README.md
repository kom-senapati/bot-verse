# Flask Starter Template

Welcome to the **Flask Starter Template**! This template provides a solid starting point for building a Flask web application with authentication, database integration, templating, and minimal styling using [Matcha CSS](https://matcha.mizu.sh/).

## What is This Template?

This template includes basic features that every Flask developer needs when starting a new project. It offers:
- Authentication system (signup, login, logout)
- Database integration with SQLAlchemy
- Templating with Jinja2
- Minimal styling using Matcha CSS
- Protected routes accessible only after login

You can quickly build upon this structure and add more features as needed!

## Technologies Used

- **Flask**: A lightweight WSGI web application framework in Python.
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM) for Python.
- **Flask-Migrate**: Extension that handles SQLAlchemy database migrations via Alembic.
- **Matcha CSS**: A Drop-in semantic styling library in pure CSS. [Learn more about Matcha CSS here](https://matcha.mizu.sh/).

For a detailed breakdown of this template, check out [this video](https://youtu.be/oQ5UfJqW5Jo) by NeuralNine.

## Routes

| Route        | Description                               |
|--------------|-------------------------------------------|
| `/`          | Landing page                              |
| `/signup`    | Sign up for a new account                 |
| `/login`     | Log into an existing account              |
| `/logout`    | Log out of the current session            |
| `/protected` | A protected page accessible after login   |

## Running Instructions

To run this template locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd flask_template
   ```

2. **Create and Activate a Virtual Environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows, use .venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up the Database**
   Initialize, migrate, and upgrade the database.
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

5. **Run the Application**
   ```bash
   python run.py
   ```

## Database Migrations

Any time you make changes to the models, ensure you follow these steps to migrate and apply changes to the database:

```bash
flask db migrate
flask db upgrade
```

## Contributing

If you find this template useful, give it a ⭐ on GitHub!
