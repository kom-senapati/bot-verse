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
