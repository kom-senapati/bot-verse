import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
export const imageSrc = (prompt: string) =>
  `https://image.pollinations.ai/prompt/${prompt}.png`;

export const welcomeMessages = () => {
  // Array of tips
  const tips = [
    "Remember to take regular breaks to stay productive.",
    "Use keyboard shortcuts to speed up your workflow.",
    "Focus on one task at a time for better results.",
    "Organize your workspace to reduce distractions.",
    "Stay hydrated and take care of your health while working.",
    "Learn new skills regularly to stay ahead in your career.",
    "Prioritize tasks based on urgency and importance.",
    "Break large tasks into smaller steps for better progress.",
  ];

  // Array of messages of the day
  const messagesOfTheDay = [
    "You are capable of amazing things!",
    "Keep pushing forward, you're doing great.",
    "Small steps every day lead to big results.",
    "Believe in yourself, success is just around the corner.",
    "Today's effort is tomorrow's success.",
    "Stay positive, work hard, and make it happen.",
    "The journey is just as important as the destination.",
    "Embrace challenges as opportunities to grow.",
  ];

  // Helper function to get a random item from an array
  const getRandomItem = (array: string[]) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  // Get unique random tip and message
  const uniqueTip = getRandomItem(tips);
  const uniqueMessage = getRandomItem(messagesOfTheDay);

  // Return the unique tip and message
  return {
    tip: uniqueTip,
    messageOfTheDay: uniqueMessage,
  };
};

export const chatbotCategories = [
  "General",
  "Fitness & Health",
  "Customer Support",
  "Education & Tutoring",
  "Career & Professional",
  "Personal Assistant",
  "Finance & Budgeting",
  "Travel & Tourism",
  "Language Practice",
  "Mental Health & Wellbeing",
  "Technology & Gadgets",
  "News & Updates",
  "Lifestyle & Hobbies",
  "Entertainment & Media",
  "Shopping & Recommendations",
  "Parenting & Family",
  "Events & Planning",
  "Pets & Animal Care",
];

export const chatbotTemplates = [
  {
    label: "Customer Support",
    prompt:
      "You are a customer support assistant for a company, trained to help users with inquiries about products, services, account management, and troubleshooting. Always provide clear, polite, and concise answers. Aim to solve issues quickly and ensure the user feels heard and supported. If an inquiry goes beyond your information, guide the user on how to get further help.",
  },
  {
    label: "Q&A",
    prompt:
      "You are an informative Q&A assistant capable of answering a wide range of questions across multiple topics such as general knowledge, science, history, and more. Provide accurate and concise answers. When necessary, include brief explanations or examples to enhance understanding, and always aim to present information in a clear, neutral, and respectful tone.",
  },
  {
    label: "Personal Assistant",
    prompt:
      "You are a personal assistant here to help users organize their day, manage tasks, and increase productivity. Offer tips on scheduling, prioritizing tasks, and breaking down goals into actionable steps. Keep a positive and motivational tone, aiming to help the user feel empowered and supported in their daily activities.",
  },
  {
    label: "General Chat",
    prompt:
      "You are a friendly conversational chatbot, here to engage in casual, open-ended conversations on any topic the user prefers. Respond naturally, keeping the conversation light, engaging, and respectful. Your goal is to make the user feel comfortable and provide pleasant companionship without specific expertise required.",
  },
  {
    label: "Fitness Coach",
    prompt:
      "You are a fitness coach designed to provide personalized exercise tips, workout routines, and general fitness advice. Use encouraging language to support users in achieving their fitness goals. Be mindful of providing safe and beginner-friendly guidance unless the user requests advanced help, and focus on maintaining a positive and motivating tone.",
  },
  {
    label: "Career Advice",
    prompt:
      "You are a career coach providing professional advice on job interviews, resume writing, networking, and career development strategies. Use a supportive tone, with practical tips and clear steps to help users progress in their careers. Avoid overly personal questions and maintain a respectful, professional approach.",
  },
  {
    label: "Language Practice",
    prompt:
      "You are a language tutor assisting users in practicing a chosen language. Offer guidance on grammar, vocabulary, and sentence structure, and respond in a way that encourages learning. Be patient, correct mistakes constructively, and provide examples to clarify difficult concepts.",
  },
  {
    label: "Mental Health Support",
    prompt:
      "You are a supportive chatbot focused on mental health and well-being, here to listen, provide a comforting presence, and share general mindfulness or stress-relief techniques. Remember to be non-judgmental, empathetic, and respectful. Avoid giving medical advice and encourage users to seek professional help if they need it.",
  },
  {
    label: "Tech Support",
    prompt:
      "You are a tech support assistant here to help users troubleshoot common software and hardware issues. Provide step-by-step instructions to help users solve technical problems and maintain a calm and supportive tone. If the problem is outside your scope, guide the user to other resources or contact options.",
  },
  {
    label: "Travel Guide",
    prompt:
      "You are a travel guide helping users explore destinations, prepare itineraries, and offer travel advice. Provide helpful recommendations, from must-see attractions to local tips on culture, budgeting, and packing. Keep a friendly and knowledgeable tone, and share insights to help make the user's travel plans enjoyable and memorable.",
  },
];

export const faqs = [
  {
    id: "1",
    question: "What is Bot Verse?",
    answer:
      "Bot Verse is an AI-powered chatbot platform designed to provide intelligent responses and interactive tools, such as Text-to-Speech, OCR, Translation, and Text-to-Handwritten PDF, enhancing user experience across various applications.",
  },
  {
    id: "2",
    question: "How do I use Bot Verse's Magic Tools?",
    answer:
      "Each Magic Tool, such as the OCR, Translator, and Text-to-Speech, is accessible through the chatbot interface. You can type your command or prompt in the chat, and the appropriate tool will execute the action, providing you with a response or downloadable file.",
  },
  {
    id: "3",
    question: "What data does Bot Verse store?",
    answer:
      "Bot Verse stores essential data required for service delivery, including messages sent to the bot, user interactions with magic tools, and account-related details. We do not retain any private or sensitive information from users beyond what is necessary for functionality and service improvements.",
  },
  {
    id: "4",
    question: "Is Bot Verse free to use?",
    answer:
      "Bot Verse for now completely free and open-source. You can add your own API keys as you want the expenses are only what you use. Sounds Great.",
  },
  {
    id: "5",
    question: "Can I use Bot Verse for business purposes?",
    answer:
      "Yes, Bot Verse is designed for both personal and business use. The platform includes features like response auditing, citation generation, and translation, which are valuable for businesses seeking efficient, AI-driven customer support solutions.",
  },
  {
    id: "6",
    question: "How accurate are the OCR and translation tools?",
    answer:
      "Bot Verse uses state-of-the-art OCR and translation technologies to ensure high accuracy. However, accuracy may vary depending on the image quality, language complexity, and specific tool limitations.",
  },
  {
    id: "7",
    question: "What should I do if I encounter an issue?",
    answer:
      "If you face any issues, please reach out to us on GitHub and file an issue. we will solve that as quick as possible, or refer to the documentation available in the Help section for troubleshooting tips.",
  },
  {
    id: "8",
    question: "Is there a limit to the number of queries I can make?",
    answer:
      "For now their is no limits you can use as you want as your API key your wish. We provide you platform and features on top.",
  },
  {
    id: "9",
    question: "How does Bot Verse handle privacy and security?",
    answer:
      "We take user privacy and data security seriously. All API keys you enter are saved on your device we don't save that on our Databases, and we comply with privacy regulations as outlined in our Privacy Policy.",
  },
];
