import os
import logging
from groq import Groq
from dotenv import load_dotenv
from typing import List, Dict
from openai import OpenAI
import google.generativeai as genai
from anthropic import Anthropic
from gtts import gTTS
import uuid
from bs4 import BeautifulSoup
import markdown
from translate import Translator
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import io

load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def generate_image_caption(image_data: bytes) -> str:
    # Load model and processor from Hugging Face
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained(
        "Salesforce/blip-image-captioning-base"
    )

    # Open image and process it
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")

    # Generate caption
    outputs = model.generate(**inputs)
    caption = processor.decode(outputs[0], skip_special_tokens=True)

    return caption


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


def markdown_to_text(markdown_text: str) -> str:
    # Convert Markdown to HTML
    html = markdown.markdown(markdown_text)
    # Use BeautifulSoup to extract text
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text()


def text_to_mp3(text: str):
    base_path = os.path.dirname(
        os.path.abspath(__file__)
    )  # Get the absolute path of the script
    temp_audio_dir = os.path.join(base_path, "temp_audio")
    os.makedirs(temp_audio_dir, exist_ok=True)
    plain_text = markdown_to_text(text)
    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(temp_audio_dir, filename)
    # print(filepath)

    # Generate speech audio file
    tts = gTTS(text=plain_text, lang="en")
    tts.save(filepath)

    return filepath


def translate_text(text: str, target_lang: str, from_lang: str):
    translator = Translator(to_lang=target_lang, from_lang=from_lang)
    translated_text = translator.translate(text)

    return translated_text
