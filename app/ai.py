from groq import Groq
from dotenv import load_dotenv
from typing import List, Dict
from openai import OpenAI
import google.generativeai as genai
from anthropic import Anthropic


load_dotenv()


def chat_with_chatbot(messages: List[Dict[str, str]], apiKey: str, engine: str) -> str:
    if engine == "groq":
        content = chat_with_groq(messages, apiKey)
        return content
    elif engine == "openai":
        content = chat_with_openai(messages, apiKey)
        return content
    elif engine == "anthropic":
        content = chat_with_anthropic(messages, apiKey)
        return content
    elif engine == "gemini":
        content = chat_with_gemini(messages, apiKey)
        return content
    else:
        raise ValueError(f"Unsupported engine: {engine}")


def chat_with_groq(messages: List[Dict[str, str]], apiKey: str) -> str:
    client = Groq(api_key=apiKey)
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content


def chat_with_openai(messages: List[Dict[str, str]], apiKey: str) -> str:
    client = OpenAI(api_key=apiKey)
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="gpt-3.5-turbo",
    )
    return chat_completion.choices[0].message.content


def chat_with_anthropic(messages: List[Dict[str, str]], apiKey: str) -> str:
    client = Anthropic(api_key=apiKey)
    chat_completion = client.messages.create(
        max_tokens=1024,
        messages=messages,
        model="claude-3-5-sonnet-latest",
    )
    return chat_completion.content


def chat_with_gemini(messages: List[Dict[str, str]], apiKey: str) -> str:
    genai.configure(api_key=apiKey)
    model = genai.GenerativeModel("gemini-1.5-flash")
    formatted_messages = [
        {
            "role": (
                message["role"] if message["role"] == "user" else "model"
            ),  # User or assistant
            "parts": [message["content"]],  # Wrap the content in a list
        }
        for message in messages
    ]
    response = model.generate_content(formatted_messages)
    return response.text
