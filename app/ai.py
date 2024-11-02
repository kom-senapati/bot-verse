import os
import logging
from groq import Groq
from dotenv import load_dotenv
from typing import List, Dict, Optional
from openai import OpenAI
import google.generativeai as genai
from anthropic import Anthropic
from gtts import gTTS
import uuid
from bs4 import BeautifulSoup
import markdown
from translate import Translator

load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def create_client(engine: str, apiKey: str):
    if engine == "groq":
        return Groq(api_key=apiKey)
    elif engine == "openai":
        return OpenAI(api_key=apiKey)
    elif engine == "anthropic":
        return Anthropic(api_key=apiKey)
    elif engine == "gemini":
        genai.configure(api_key=apiKey)
        return genai.GenerativeModel("gemini-1.5-flash")
    else:
        logger.error(f"Unsupported engine: {engine}")
        raise ValueError(f"Unsupported engine: {engine}")

def chat_with_chatbot(messages: List[Dict[str, str]], apiKey: str, engine: str) -> str:
    if not apiKey:
        logger.error("API key is missing.")
        raise ValueError("API key is required for making API requests.")

    try:
        client = create_client(engine, apiKey)
        if engine == "groq":
            return chat_with_groq(client, messages)
        elif engine == "openai":
            return chat_with_openai(client, messages)
        elif engine == "anthropic":
            return chat_with_anthropic(client, messages)
        elif engine == "gemini":
            return chat_with_gemini(client, messages)
    except Exception as e:
        logger.error(f"Error in chat_with_chatbot function with engine {engine}: {e}")
        raise

def chat_with_groq(client: Groq, messages: List[Dict[str, str]]) -> str:
    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        logger.error(f"Error in chat_with_groq: {e}")
        raise

def chat_with_openai(client: OpenAI, messages: List[Dict[str, str]]) -> str:
    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="gpt-3.5-turbo",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        logger.error(f"Error in chat_with_openai: {e}")
        raise

def chat_with_anthropic(client: Anthropic, messages: List[Dict[str, str]]) -> str:
    try:
        chat_completion = client.messages.create(
            max_tokens=1024,
            messages=messages,
            model="claude-3-5-sonnet-latest",
        )
        return chat_completion.content
    except Exception as e:
        logger.error(f"Error in chat_with_anthropic: {e}")
        raise

def chat_with_gemini(client, messages: List[Dict[str, str]]) -> str:
    try:
        formatted_messages = [
            {
                "role": message["role"] if message["role"] == "user" else "model",
                "parts": [message["content"]],
            }
            for message in messages
        ]
        response = client.generate_content(formatted_messages)
        return response.text
    except Exception as e:
        logger.error(f"Error in chat_with_gemini: {e}")
        raise

def markdown_to_text(markdown_text: str) -> str:
    """Convert Markdown to plain text."""
    html = markdown.markdown(markdown_text)
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text()

def text_to_mp3(text: str) -> str:
    """Convert text to MP3 audio file."""
    base_path = os.path.dirname(os.path.abspath(__file__))  # Get the absolute path of the script
    temp_audio_dir = os.path.join(base_path, "temp_audio")
    os.makedirs(temp_audio_dir, exist_ok=True)
    plain_text = markdown_to_text(text)
    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(temp_audio_dir, filename)

    # Generate speech audio file
    tts = gTTS(text=plain_text, lang="en")
    tts.save(filepath)
    
    logger.info(f"Audio file saved at: {filepath}")
    return filepath

def translate_text(text: str, target_lang: str, from_lang: Optional[str] = None) -> str:
    """Translate text to the target language."""
    translator = Translator(to_lang=target_lang, from_lang=from_lang)
    translated_text = translator.translate(text)
    logger.info(f"Translated text from {from_lang} to {target_lang}")
    
    return translated_text
