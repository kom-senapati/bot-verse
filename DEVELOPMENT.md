# Development Guide for Bot Verse 🚀

Welcome to the **Bot Verse** development guide! This document outlines how to set up the project for local development, the core components involved, and how to contribute effectively.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Contributing](#contributing)
- [Code Style and Guidelines](#code-style-and-guidelines)
- [Debugging Tips](#debugging-tips)

## Getting Started

To contribute to the Bot Verse project, follow these steps to get the environment set up locally.

### Prerequisites

- [**Python 3.8+**](https://www.python.org/)
- [**Flask**](https://flask.palletsprojects.com/en/stable/) for the backend
- [**React with Vite**](https://react.dev/) for the client
- [**Tailwind CSS**](https://tailwindcss.com/docs) for styling

Install the required dependencies by running:

```bash
pip install -r requirements.txt
```

### Client Dependencies

To manage client dependencies and build tools:

```bash
cd client && bun install
```

---

## Project Structure

```
Bot-Verse/
├── .                 # Flask-based API and chatbot management
├── client/           # React (Vite) based client
├── migrations/         # Database migrations
├── tests/              # Unit and integration tests
├── .env                # Environment variables
├── requirements.txt    # Python dependencies
└── README.md           # Project readme
```

---

## Development Workflow

### 1 Create a Virtual Environment

```bash
python -m venv .venv
```

### 2 Activate the Virtual Environment

- **On Windows:**

  ```bash
  source .venv/Scripts/activate
  ```

- **On macOS/Linux:**

  ```bash
  source .venv/bin/activate
  ```

### 3 Install Dependencies

```bash
pip install -r requirements.txt
```

### 4 Initialize the Database

```bash
flask db init
```

### 5 Apply Database Migrations

```bash
flask db migrate -m "Initial migration"
flask db upgrade
```

### 5 Run Backend API

```bash
python run.py
```

The application will be available at `http://127.0.0.1:5000`.

### 7. Setting up Frontend

In the `client` directory, start the React development server:

```bash
bun dev
```

This will launch the frontend on `http://localhost:3000`.

### 8. Database Migrations

If you make changes to the database schema, ensure to handle migrations with:

```bash
flask db migrate -m "Describe migration"
flask db upgrade
```

---

## Running the Project

- **Backend (root)**: `python run.py`
- **Client**: `bun dev`
- **Database Migrations**: `flask db upgrade`

---

## Testing

To run tests, use the following command:

```bash
pytest
```

Ensure all new features have accompanying tests.

---

## Contributing

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) and follow the guidelines. Contributions are welcome and appreciated!

---

## Code Style and Guidelines

- **Python**: Follow PEP8 guidelines for the backend.
- **TypeScript/React**: Use ESLint and Prettier for code formatting.

Make sure your code is clean, documented, and tested before submitting a pull request.

---

## Debugging Tips

- Use Flask's `debug=True` mode for easier debugging on the backend.
- React error boundaries and Chrome DevTools can help troubleshoot frontend issues.

---

Happy coding! 🎉
