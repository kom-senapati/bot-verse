import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SERVER_URL = import.meta.env.SERVER_URL || "http://localhost:5000";
export const imageSrc = (prompt: string) =>
  `https://image.pollinations.ai/prompt/${prompt}`;
