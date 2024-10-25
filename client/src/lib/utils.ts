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
