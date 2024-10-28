import os
import logging
from groq import Groq
from dotenv import load_dotenv
from typing import List, Dict
from openai import OpenAI
import google.generativeai as genai
from anthropic import Anthropic

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def chat_with_chatbot(messages: List[Dict[str, str]], apiKey: str, engine: str) -> str:
    if not apiKey:
        logger.error("API key is missing.")
        raise ValueError("API key is required for making API requests.")
    
    try:
        if engine == "groq":
            content = chat_with_groq(messages, apiKey)
        elif engine == "openai":
            content = chat_with_openai(messages, apiKey)
        elif engine == "anthropic":
            content = chat_with_anthropic(messages, apiKey)
        elif engine == "gemini":
            content = chat_with_gemini(messages, apiKey)
        else:
            logger.error(f"Unsupported engine: {engine}")
            raise ValueError(f"Unsupported engine: {engine}")
        logger.info(f"Request to {engine} API was successful.")
        return content
    except Exception as e:
        logger.error(f"Error in chat_with_chatbot function with engine {engine}: {e}")
        raise

def chat_with_groq(messages: List[Dict[str, str]], apiKey: str) -> str:
    try:
        client = Groq(api_key=apiKey)
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        logger.error(f"Error in chat_with_groq: {e}")
        raise

def chat_with_openai(messages: List[Dict[str, str]], apiKey: str) -> str:
    try:
        client = OpenAI(api_key=apiKey)
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="gpt-3.5-turbo",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        logger.error(f"Error in chat_with_openai: {e}")
        raise

def chat_with_anthropic(messages: List[Dict[str, str]], apiKey: str) -> str:
    try:
        client = Anthropic(api_key=apiKey)
        chat_completion = client.messages.create(
            max_tokens=1024,
            messages=messages,
            model="claude-3-5-sonnet-latest",
        )
        return chat_completion.content
    except Exception as e:
        logger.error(f"Error in chat_with_anthropic: {e}")
        raise

def chat_with_gemini(messages: List[Dict[str, str]], apiKey: str) -> str:
    try:
        genai.configure(api_key=apiKey)
        model = genai.GenerativeModel("gemini-1.5-flash")
        formatted_messages = [
            {
                "role": message["role"] if message["role"] == "user" else "model",
                "parts": [message["content"]],
            }
            for message in messages
        ]
        response = model.generate_content(formatted_messages)
        return response.text
    except Exception as e:
        logger.error(f"Error in chat_with_gemini: {e}")
        raise
