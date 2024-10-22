import axios from "axios";
import { SERVER_URL } from "./utils";

interface DashboardResponse {
  success: boolean;
  tip: string;
  quote_of_the_day: string;
  image_of_the_day: ImageGen;
  chatbot_of_the_day: Chatbot;
  systemBots: Chatbot[];
  bots: Chatbot[];
  date: Date;
}
interface ChatbotResponse {
  chats: Chat[];
  bot: Chatbot;
}
interface HubResponse {
  bots: Chatbot[];
  images: ImageGen[];
}

const token = localStorage.getItem("token");
export const authHeaders = {
  Authorization: `Bearer ${token}`,
};

export const fetchDashboardData = async (): Promise<
  DashboardResponse | undefined
> => {
  const { data } = await axios.get(`${SERVER_URL}/api/dashboard_data`, {
    headers: authHeaders,
  });
  return data;
};

export const fetchHubData = async (): Promise<HubResponse | undefined> => {
  const { data } = await axios.get(`${SERVER_URL}/api/hub_data`, {
    headers: authHeaders,
  });
  return data;
};

export const fetchChatbotData = async (
  id: string
): Promise<ChatbotResponse> => {
  const { data } = await axios.get(`${SERVER_URL}/api/chatbot/${id}`, {
    headers: authHeaders,
  });
  return data;
};

export const publishChatbot = async (
  id: number
): Promise<boolean | undefined> => {
  const { data } = await axios.post(
    `${SERVER_URL}/api/chatbot/${id}/publish`,
    {},
    {
      headers: authHeaders,
    }
  );
  return data.public;
};

export const deleteAllChats = async (id: string): Promise<void> => {
  const { data } = await axios.post(
    `${SERVER_URL}/api/chatbot/${id}/clear`,
    {},
    {
      headers: authHeaders,
    }
  );
  return data;
};

export const likeAndReport = async ({
  action,
  id,
  type,
}: {
  id: number;
  type: "image" | "chatbot";
  action: "like" | "report";
}): Promise<void> => {
  const { data } = await axios.post(
    `${SERVER_URL}/api/${type}/${id}/${action}`,
    {},
    {
      headers: authHeaders,
    }
  );
  return data;
};
