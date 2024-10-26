from groq import Groq
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()


def chat_with_chatbot(messages: List[Dict[str, str]], apiKey: str) -> str:
    client = Groq(api_key=apiKey)
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content
