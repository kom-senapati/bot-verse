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

interface ProfileResponse {
  user: User;
  contribution_score: number;
}

const token = localStorage.getItem("token");

export const authHeaders = {
  Authorization: `Bearer ${token || ""}`,
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

export const fetchProfileData = async (
  username: string
): Promise<ProfileResponse> => {
  const { data } = await axios.get(`${SERVER_URL}/api/user/${username}`, {
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

export const fetchImagesData = async (): Promise<ImageGen[]> => {
  const { data } = await axios.get(`${SERVER_URL}/api/imagine`, {
    headers: authHeaders,
  });
  return data.images;
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
  type: "image" | "chatbot" | "user";
  action: "like" | "report";
}): Promise<void> => {
  const { data } = await axios.post(
    `${SERVER_URL}/api/actions/${type}/${id}/${action}`,
    {},
    {
      headers: authHeaders,
    }
  );
  return data;
};

interface DataResponse {
  system_bots?: Chatbot[]; // Optional property
  my_bots?: Chatbot[]; // Optional property
  my_images?: ImageGen[]; // Optional property
  public_bots?: Chatbot[]; // Optional property
  user_bots?: Chatbot[]; // Optional property
  public_images?: ImageGen[]; // Optional property
}

const validQueues = [
  "system_bots",
  "my_bots",
  "my_images",
  "public_bots",
  "public_images",
  "user_bots",
] as const;

type ValidQueue = (typeof validQueues)[number];

export const fetchData = async ({
  queues,
  uid,
}: {
  queues: ValidQueue[];
  uid?: number;
}): Promise<DataResponse> => {
  const queuesParam = queues.join(",");
  const { data } = await axios.get(
    `${SERVER_URL}/api/data?queues=${queuesParam}&uid=${uid}`,
    {
      headers: authHeaders,
    }
  );
  return data;
};
