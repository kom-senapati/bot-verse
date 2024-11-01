import os
import logging
from functools import lru_cache
from typing import List, Dict, Callable
from dataclasses import dataclass
from pathlib import Path
from groq import Groq
from dotenv import load_dotenv
from openai import OpenAI
import google.generativeai as genai
from anthropic import Anthropic
from gtts import gTTS
import uuid
from bs4 import BeautifulSoup
import markdown
from translate import Translator

# Load environment variables once at module import
load_dotenv()

# Set up logging with a more detailed format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

@dataclass
class ChatbotConfig:
    """Configuration class for chatbot settings"""
    model_names = {
        "groq": "llama3-8b-8192",
        "openai": "gpt-3.5-turbo",
        "anthropic": "claude-3-5-sonnet-latest",
        "gemini": "gemini-1.5-flash"
    }
    max_tokens: int = 1024
    temp_audio_dir: Path = Path(__file__).parent / "temp_audio"

# Create config instance
config = ChatbotConfig()

# Ensure temp audio directory exists
config.temp_audio_dir.mkdir(exist_ok=True)

class ChatbotError(Exception):
    """Custom exception for chatbot-related errors"""
    pass

def create_client(engine: str, api_key: str) -> object:
    """Factory function to create API clients"""
    clients = {
        "groq": lambda: Groq(api_key=api_key),
        "openai": lambda: OpenAI(api_key=api_key),
        "anthropic": lambda: Anthropic(api_key=api_key),
        "gemini": lambda: genai.configure(api_key=api_key) or genai.GenerativeModel(config.model_names["gemini"])
    }
    
    if engine not in clients:
        raise ChatbotError(f"Unsupported engine: {engine}")
    
    return clients[engine]()

def chat_with_chatbot(messages: List[Dict[str, str]], api_key: str, engine: str) -> str:
    """Main function to interact with different chatbot engines"""
    if not api_key:
        raise ChatbotError("API key is required for making API requests.")

    try:
        client = create_client(engine, api_key)
        
        if engine == "gemini":
            formatted_messages = [
                {
                    "role": "user" if msg["role"] == "user" else "model",
                    "parts": [msg["content"]]
                }
                for msg in messages
            ]
            response = client.generate_content(formatted_messages)
            content = response.text
        else:
            kwargs = {
                "messages": messages,
                "model": config.model_names[engine],
            }
            if engine == "anthropic":
                kwargs["max_tokens"] = config.max_tokens
                response = client.messages.create(**kwargs)
                content = response.content
            else:
                response = client.chat.completions.create(**kwargs)
                content = response.choices[0].message.content

        logger.info(f"Request to {engine} API was successful.")
        return content

    except Exception as e:
        logger.error(f"Error in chat_with_chatbot function with engine {engine}: {str(e)}")
        raise ChatbotError(f"Error communicating with {engine}: {str(e)}")

@lru_cache(maxsize=1000)
def markdown_to_text(markdown_text: str) -> str:
    """Convert markdown to plain text with caching"""
    html = markdown.markdown(markdown_text)
    return BeautifulSoup(html, "html.parser").get_text()

def text_to_mp3(text: str) -> str:
    """Convert text to MP3 audio file"""
    plain_text = markdown_to_text(text)
    filename = f"{uuid.uuid4()}.mp3"
    filepath = config.temp_audio_dir / filename
    
    tts = gTTS(text=plain_text, lang="en")
    tts.save(str(filepath))
    
    return str(filepath)

@lru_cache(maxsize=100)
def translate_text(text: str, target_lang: str, from_lang: str) -> str:
    """Translate text with caching"""
    translator = Translator(to_lang=target_lang, from_lang=from_lang)
    return translator.translate(text)