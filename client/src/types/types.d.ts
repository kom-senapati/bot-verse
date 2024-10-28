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
  name: string;
  avatar: string;
  prompt: string;
  generated_by: string;
  public: boolean;
  user_id: number;
  likes: number;
  reports: number;
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
