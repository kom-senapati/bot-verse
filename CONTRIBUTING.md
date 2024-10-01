# Contributing to Bot Verse

Thanks for considering contributing to **Bot Verse**! We're excited to collaborate and build this platform together.

## How to Contribute

### Reporting Issues
If you encounter any bugs or have feature requests, please open an issue on the GitHub repository. Be as detailed as possible to help us address the issue quickly.

### Suggesting Enhancements
We welcome suggestions! Please open an issue to discuss your ideas before starting work on a pull request.

### Submitting Pull Requests
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Make your changes, ensuring that your code adheres to our guidelines.
4. Push the branch to your forked repo (`git push origin feature/my-feature`).
5. Create a pull request against the `main` branch of the repository.

### Coding Guidelines
- Ensure all new features and fixes are well tested.
- Update documentation for any new features.

## Development Setup

To set up and run Bot Verse locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/kom-senapati/bot-verse.git
   cd bot-verse
   ```

2. **Create a Virtual Environment:**

   ```bash
   python -m venv .venv
   ```

3. **Activate the Virtual Environment:**

   - **On Windows:**

     ```bash
     .venv\Scripts\activate
     ```

   - **On macOS/Linux:**

     ```bash
     source .venv/bin/activate
     ```

4. **Install Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

5. **Set Up the Environment Variables:**

   Create a `.env` file in the root directory of the project and add the required environment variables:

   ```
   GROQ_API_KEY=your_groq_api_key
   ```

6. **Initialize the Database:**

   ```bash
   flask db init
   ```

7. **Apply Database Migrations:**

   ```bash
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

8. **Run the Application:**

   ```bash
   python run.py
   ```

   The application will be available at `http://127.0.0.1:5000`.


## Pull Request Guidelines
- Link the pull request to a relevant issue, if applicable.
- Keep the pull request focused; one PR per feature or fix.
- Wait for a code review before merging.

## Community

Join our discussions and feel free to ask questions or offer suggestions in our [community channel](https://discord.gg/xhFGrRPvnV).

## License

By contributing, you agree that your contributions will be licensed under the same [MIT License](./LICENSE) as the project.
