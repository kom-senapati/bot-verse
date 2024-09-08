# Bot Verse 🚀

**Bot Verse** is an innovative platform for creating, sharing, and interacting with AI chatbots. Users can manage their own chatbots, explore public and system chatbots, and leverage pre-made solutions for various tasks. This project is open source and welcomes contributions from the community.

## Features 🌟

- **Authentication** 🔐: Secure sign-up, login, and logout functionality.
- **CRUD for Chatbots** ✍️: Create, update, delete, and manage your chatbots effortlessly.
- **Public Chatbots** 🌍: Share your chatbots with the community and discover others' creations.
- **System Chatbots** 🛠️: Use pre-made chatbots for common tasks and questions.

## Tech Stack 🛠️

![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/-Flask-000000?logo=flask&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-0B0B0B?logo=sqlalchemy&logoColor=white)
![SQLite](https://img.shields.io/badge/-SQLite-003B57?logo=sqlite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![GROQ](https://img.shields.io/badge/-GROQ-006D77?logo=groq&logoColor=white)
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white)

## Installation ⚙️

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

## License 📝

Bot Verse is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for more information.
