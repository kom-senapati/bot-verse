import os
from groq import Groq
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def chat_with_chatbot(messages: List[Dict[str, str]]) -> str:
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content
