import { LikeAndReport } from "@/components/LikeAndReport";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { authHeaders, fetchChatbotViewData } from "@/lib/queries";
import { SERVER_URL } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MessageCircle, Send, ThumbsUp } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ChatbotViewPage() {
  const { chatbotId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const qc = useQueryClient();
  if (!chatbotId) return null;
  const { data, isLoading } = useQuery({
    queryKey: ["chatbot_view", chatbotId],
    queryFn: () => fetchChatbotViewData(chatbotId),
  });
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !comment) {
      toast.error("Please fill in both fields");
      return;
    }

    try {
      const response = await axios.post(
        `${SERVER_URL}/api/chatbot/comment`,
        {
          name,
          message: comment,
          chatbotId: chatbotId,
        },
        { headers: { ...authHeaders } }
      );

      if (response.status == 200) {
        toast.success("Comment submitted successfully!");
        // Optionally, clear the form inputs
        setName("");
        setComment("");
        // Refresh the comments list here (re-fetch data)
        qc.invalidateQueries({
          queryKey: ["chatbot_view", chatbotId],
        });
      } else {
        toast.error("Failed to submit comment. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("An error occurred while submitting the comment.");
    }
  };

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

  if (!data) {
    return (
      <div className="text-center p-6 space-y-4">
        <p>No Chatbot data available.</p>
        <Button onClick={() => navigate("/hub")}>Go to Hub</Button>
      </div>
    );
  }
  const { bot, comments } = data;
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
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div
          className="space-y-4 mb-8 max-h-[500px] overflow-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {comments.map((c) => (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {c.name.at(0)}
                      {c.name.at(1)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>{c.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leave a Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmitComment}>
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="comment"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Comment
                </label>
                <Textarea
                  id="comment"
                  placeholder="Write your comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <Button>
                <Send className="mr-2 h-4 w-4" type="submit" />
                Submit Comment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
