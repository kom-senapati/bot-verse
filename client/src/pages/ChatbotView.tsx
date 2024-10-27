import { LikeAndReport } from "@/components/LikeAndReport";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchChatbotViewData } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ChatbotViewPage() {
  const { chatbotId } = useParams();
  const navigate = useNavigate();
  if (!chatbotId) return null;

  const { data: bot, isLoading } = useQuery({
    queryKey: ["chatbot_view", chatbotId],
    queryFn: () => fetchChatbotViewData(chatbotId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="text-center p-6 space-y-4">
        <p>No Chatbot data available.</p>
        <Button onClick={() => navigate("/hub")}>Go to Hub</Button>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={bot.name} src={bot.avatar} />
              <AvatarFallback>{bot.name.at(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{bot.name}</CardTitle>
              <CardDescription>Creator: @{bot.generated_by}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Prompt: {bot.prompt}</p>
            <div className="mt-4 flex justify-end items-center text-2xl">
              <Link
                to={`/chatbot/${bot.id}`}
                className="text-primary hover:text-primary/90 transition duration-300 p-2 rounded-full hover:bg-primary/10"
              >
                <MessageCircle />
              </Link>
              <LikeAndReport
                id={bot.id}
                likes={bot.likes}
                reports={bot.reports}
                queryKeys={["chatbot_view", chatbotId]}
                type="chatbot"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
