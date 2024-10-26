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

- **Python 3.8+**
- **Flask** for the backend
- **React with Vite** for the client
- **Tailwind CSS** for styling

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

### 1. Setting up Backend

Make sure your Python virtual environment is activated, and run the Flask server:

```bash
flask run
```

### 2. Setting up Frontend

In the `client` directory, start the React development server:

```bash
bun dev
```

This will launch the frontend on `http://localhost:3000`.

### 3. Database Migrations

If you make changes to the database schema, ensure to handle migrations with:

```bash
flask db init
flask db migrate -m "Describe migration"
flask db upgrade
```

---

## Running the Project

- **Backend (root)**: `flask run`
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
