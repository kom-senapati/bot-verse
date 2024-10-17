# Bot Verse 🚀

**Bot Verse** is an innovative platform for creating, sharing, and interacting with AI chatbots. Users can manage their own chatbots, explore public and system chatbots, and leverage pre-made solutions for various tasks. This project is open source and welcomes contributions from the community.

# Table of Contents

- [Features 🌟](#features-🌟)
  - [Authentication 🔐](#authentication-🔐)
  - [CRUD for Chatbots ✍️](#crud-for-chatbots-✍️)
  - [Public Chatbots 🌍](#public-chatbots-🌍)
  - [System Chatbots 🛠️](#system-chatbots-🛠️)
  - [Search Functionality 🔍](#search-functionality-🔍)
  - [Dark/Light Mode Toggle 🌗](#darklight-mode-toggle-🌗)
- [Tech Stack 🛠️](#tech-stack-🛠️)
- [Open Source Programs 💪](#open-source-programs-💪)
- [Ready to Contribute? ✨](#ready-to-contribute-✨)
- [Installation ⚙️](#installation-⚙️)
- [Valuable Contributors ❤️✨](#our-valuable-contributors-❤️✨)
- [Show Your Support ❤️](#show-your-support-❤️)
- [License 📄](#license-📄)

## Features 🌟

- **Authentication** 🔐: Secure sign-up, login, and logout functionality.
- **CRUD for Chatbots** ✍️: Create, update, delete, and manage your chatbots effortlessly.
- **Public Chatbots** 🌍: Share your chatbots with the community and discover others' creations.
- **System Chatbots** 🛠️: Use pre-made chatbots for common tasks and questions.
- **Search Functionality** 🔍: Easily filter chatbots by name or description in the dashboard.
- **Dark/Light Mode Toggle** 🌗: Switch between light and dark themes using a toggle button, with preferences saved using localStorage.

## Tech Stack 🛠️

![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/-Flask-000000?logo=flask&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-0B0B0B?logo=sqlalchemy&logoColor=white)
![SQLite](https://img.shields.io/badge/-SQLite-003B57?logo=sqlite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![GROQ](https://img.shields.io/badge/-GROQ-006D77?logo=groq&logoColor=white)
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white)

<div>
   <h2><img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f4aa/512.webp" width="35" height="35" >Open Source Programs</h2>
</div>
<table border="1" cellpadding="10">
    <tr>
        <td rowspan="2">
            <img src="https://gssoc.girlscript.tech/GS_logo_White.svg" alt="VSOC Logo" width="400" height="85">
        </td>
        <td>
            <strong>GSSOC 2024</strong>
        </td>
    </tr>
    <tr>
        <td>
            This project is part of GirlScript Summer of Code Extd. We welcome contributions from the community.
        </td>
    </tr>
</table>

<div>
  <h2><img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31f/512.webp" width="35" height="35"> Ready to Contribute?</h2>
</div>

Kindly go through [CONTRIBUTING.md](CONTRIBUTING.md) to understand everything from setup to contributing guidelines and must follow [Code of Conduct](CODE_OF_CONDUCT.md)

If you would like to contribute to the project, please follow our contribution guidelines.

<details>
   <summary><h2>Installation ⚙️</h2></summary>
   
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
     source .venv/Scripts/activate
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

8. **Setup tailwind for styling (Only if any UI changes).**

Download `Tailwind CLI` from official [releases](https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.10) page. Make sure you download that accounding to your os. Keep that executor in folder inside the project `/tailwind`. And rename downloaded file to `tailwindcss`.

10. **Only for linux give execution permissions.**

    ```bash
    chmod +x tailwind/tailwindcss
    ```

11. **Run the Python Script to generate styles**

    ```bash
    python build_css.py --watch
    ```

12. **Run the Application:**

    ```bash
    python run.py
    ```

    The application will be available at `http://127.0.0.1:5000`.

</details>

<div align="center">
  <h1>Tip from us 😇</h1>
  <p>It always takes time to understand and learn. So, don't worry at all. We know <b>you have got this</b>! 💪</p>
</div>

## 👀 Our Valuable Contributors 💖✨

## Contributors

<div align="center" style="border-radius: 15px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin: 10px;">
  <a href="https://github.com/kom-senapati/bot-verse/graphs/contributors">
    <img 
      src="https://contrib.rocks/image?repo=kom-senapati/bot-verse&max=100" 
      alt="Contributors" 
      style="border-radius: 15px; max-width: 100%; height: auto;" 
    />
  </a>
</div>


<!-- readme: contributors -end -->
---

<div>
  <h2><img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/512.webp" width="35" height="35"> Show Your Support</h2>
</div>

If you find this project interesting and inspiring, please consider showing your support by starring it on GitHub! Your star goes a long way in helping us to reach more developers and encourages to keep enhancing the project.

<div>
  <h2><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Objects/Memo.webp" alt="Memo" width="35" height="35" /> License</h2>
</div>

Bot Verse is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for more information.

<img src="https://media.giphy.com/media/LnQjpWaON8nhr21vNW/giphy.gif" width="60"> <em><b>I love connecting with different people</b>, so if you want to say <b>hi, I'll be happy to meet you more!</b> :)<br> Welcome to our community—<a href="https://discord.gg/xhFGrRPvnV" target="_blank">join our Discord</a>.</em>

<a href="#top"><img src="https://img.shields.io/badge/-Back%20to%20Top-red?style=for-the-badge" align="right"/></a>
