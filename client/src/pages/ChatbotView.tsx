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
import { useAuth } from "@/contexts/auth-context";
import { fetchChatbotViewData, likeAndReport, publishObj } from "@/lib/queries";
import { SERVER_URL } from "@/lib/utils";
import {
  useDeleteChatbotModal,
  useUpdateChatbotModal,
} from "@/stores/modal-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Flag,
  Heart,
  MessageSquare,
  Pencil,
  Send,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ChatbotViewPage() {
  const { chatbotId } = useParams();
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const qc = useQueryClient();
  const deleteModal = useDeleteChatbotModal();
  const updateModal = useUpdateChatbotModal();
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
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
      };
      const response = await axios.post(
        `${SERVER_URL}/api/chatbot/comment`,
        {
          name,
          message: comment,
          chatbotId: chatbotId,
        },
        { headers: authHeaders }
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

  const mutation = useMutation({
    mutationFn: publishObj,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["chatbot_view", chatbotId] }),
  });

  const actionsMutation = useMutation({
    mutationFn: likeAndReport,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["chatbot_view", chatbotId] }),
  });

  if (isLoading || loading) {
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
  const { bot, comments, versions } = data;

  const showActions = bot.user_id === user?.id;
  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={bot.latest_version.name} src={bot.avatar} />
              <AvatarFallback>{bot.latest_version.name.at(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{bot.latest_version.name}</CardTitle>
              <CardDescription>
                Creator: @{bot.latest_version.modified_by}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Prompt: {bot.latest_version.prompt}
            </p>
            <p className="text-muted-foreground font-bold my-2 underline cursor-pointer">
              Current Version: {bot.latest_version.version_number}
            </p>
            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    actionsMutation.mutate({
                      action: "like",
                      id: bot.id,
                      type: "chatbot",
                    })
                  }
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Like</span>
                </Button>
                <span
                  className="inline-flex items-center text-sm text-muted-foreground"
                  aria-label="Like count"
                >
                  {bot.likes}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    actionsMutation.mutate({
                      action: "report",
                      id: bot.id,
                      type: "chatbot",
                    })
                  }
                >
                  <Flag className="h-4 w-4" />
                  <span className="sr-only">Report</span>
                </Button>
                <span
                  className="inline-flex items-center text-sm text-muted-foreground"
                  aria-label="Like count"
                >
                  {bot.reports}
                </span>
              </div>
              <div className="flex gap-2">
                <Link to={`/chatbot/${bot.id}`}>
                  <Button variant="default">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
          {showActions && (
            <CardFooter>
              <div className="flex justify-end space-x-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateModal.onOpen({
                      id: bot.id,
                      prevName: bot.latest_version.name,
                      prevPrompt: bot.latest_version.prompt,
                      prevCategory: bot.category,
                      versions: versions,
                    })
                  }
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    deleteModal.onOpen({
                      id: bot.id,
                      obj: "chatbot",
                      queryKeys: ["chatbot_view", chatbotId],
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>

                <Button
                  variant={bot.public ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    mutation.mutate({
                      id: bot.id,
                      obj: "chatbot",
                    })
                  }
                >
                  <Send className="h-4 w-4 mr-2" />
                  {bot.public ? "Unpublish" : "Publish"}
                </Button>
              </div>
            </CardFooter>
          )}
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
              <CardFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    actionsMutation.mutate({
                      action: "like",
                      id: c.id,
                      type: "comment",
                    })
                  }
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  <span
                    className="inline-flex items-center text-sm text-muted-foreground"
                    aria-label="Like count"
                  >
                    {c.likes}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    actionsMutation.mutate({
                      action: "report",
                      id: c.id,
                      type: "comment",
                    })
                  }
                >
                  <Flag className="mr-2 h-4 w-4" />
                  <span
                    className="inline-flex items-center text-sm text-muted-foreground"
                    aria-label="Like count"
                  >
                    {c.reports}
                  </span>
                </Button>
              </CardFooter>
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
