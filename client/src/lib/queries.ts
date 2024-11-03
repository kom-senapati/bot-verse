import axios from "axios";
import { SERVER_URL } from "./utils";

interface ChatbotResponse {
  chats: Chat[];
  bot: Chatbot;
}

interface ProfileResponse {
  user: User;
  contribution_score: number;
}

export const fetchProfileData = async (
  username: string
): Promise<ProfileResponse> => {
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token || ""}`,
  };
  const { data } = await axios.get(`${SERVER_URL}/api/user/${username}`, {
    headers: authHeaders,
  });
  return data;
};

export const fetchChatbotData = async (
  id: string
): Promise<ChatbotResponse> => {
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token || ""}`,
  };
  const { data } = await axios.get(`${SERVER_URL}/api/chatbot/${id}`, {
    headers: authHeaders,
  });
  return data;
};

export const fetchChatbotViewData = async (
  id: string
): Promise<{
  bot: Chatbot;
  comments: ChatbotComment[];
  versions: ChatbotVersion[];
}> => {
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token || ""}`,
  };
  const { data } = await axios.get(`${SERVER_URL}/api/chatbot_data/${id}`, {
    headers: authHeaders,
  });
  return data;
};

export const fetchImagesData = async (): Promise<ImageGen[]> => {
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token || ""}`,
  };
  const { data } = await axios.get(`${SERVER_URL}/api/imagine`, {
    headers: authHeaders,
  });
  return data.images;
};

export const publishObj = async ({
  id,
  obj,
}: {
  id: number;
  obj: "chatbot" | "image";
}): Promise<boolean | undefined> => {
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token || ""}`,
  };
  const { data } = await axios.post(
    `${SERVER_URL}/api/publish/${obj}/${id}`,
    {},
    {
      headers: authHeaders,
    }
  );
  return data.public;
};

export const deleteObj = async ({
  id,
  obj,
}: {
  id: number;
  obj: "chatbot" | "image";
}): Promise<void> => {
  const token = localStorage.getItem("token");
  const authHeaders = {
    Authorization: `Bearer ${token || ""}`,
  };
  const { data } = await axios.post(
    `${SERVER_URL}/api/delete/${obj}/${id}`,
    {},
    {
      headers: authHeaders,
    }
  );
  return data;
};

export const deleteAllChats = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token || ""}`,
  };
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
  type: "image" | "chatbot" | "user" | "comment";
  action: "like" | "report";
}): Promise<void> => {
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token || ""}`,
  };
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
  user_images?: ImageGen[]; // Optional property
  public_bots?: Chatbot[]; // Optional property
  user_bots?: Chatbot[]; // Optional property
  public_images?: ImageGen[]; // Optional property
  trend_today?: {
    chatbot: Chatbot;
    image?: ImageGen;
  }; // Optional property
  leaderboard?: User[];
}

const validQueues = [
  "system_bots",
  "my_bots",
  "my_images",
  "public_bots",
  "public_images",
  "user_bots",
  "trend_today",
  "leaderboard",
  "user_images",
] as const;

type ValidQueue = (typeof validQueues)[number];

export const fetchData = async ({
  queues,
  uid,
}: {
  queues: ValidQueue[];
  uid?: number;
}): Promise<DataResponse> => {
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token || ""}`,
  };
  const queuesParam = queues.join(",");
  const { data } = await axios.get(
    `${SERVER_URL}/api/data?queues=${queuesParam}${uid ? `&uid=${uid}` : ""}`,
    {
      headers: authHeaders,
    }
  );
  return data;
};
