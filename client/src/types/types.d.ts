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
