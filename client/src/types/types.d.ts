interface EngineConfig {
  apiKey: string;
  engine: string;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  username: string;
  email: string;
  bio?: string;
  likes: number;
  reports: number;
  contribution_score: number;
  created_at: Date;
}

type ChatbotComment = {
  id: number;
  name: string;
  message: string;
  chatbot_id: number;
  likes: number;
  reports: number;
};

type Chatbot = {
  id: number;
  avatar: string;
  public: boolean;
  category: string;
  user_id: number;
  likes: number;
  reports: number;
  latest_version: ChatbotVersion;
};

type ChatbotVersion = {
  id: number;
  chatbot_id: string;
  name: string;
  prompt: string;
  modified_by: number;
  created_at: Date;
  version_number: string;
};

type Chat = {
  id: number;
  chatbot_id: number;
  user_id: number;
  user_query: string;
  response: string;
};

type ImageGen = {
  id: number;
  prompt: string;
  public: boolean;
  user_id: number;
  likes: number;
  reports: number;
};
