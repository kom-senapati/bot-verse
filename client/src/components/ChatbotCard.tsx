import { Flag, Heart, MessageSquare, Share2, Trash2 } from "lucide-react"; // Import the Trash icon
import { useShareModal } from "@/stores/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeAndReport, deleteChatbot } from "@/lib/queries"; // Ensure you have a deleteChatbot function
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Optional for notifications

export function ChatbotCard({
  chatbot,
  queryKeys,
}: {
  chatbot: Chatbot;
  queryKeys: string[];
}) {
  const shareModel = useShareModal();
  const rq = useQueryClient();
  const navigate = useNavigate();

  const likeMutation = useMutation({
    mutationFn: likeAndReport,
    onSuccess: () => rq.invalidateQueries({ queryKey: queryKeys }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChatbot, // Your API function to delete a chatbot
    onSuccess: () => {
      rq.invalidateQueries({ queryKey: queryKeys });
      toast.success("Chatbot deleted successfully!"); // Notify the user
    },
    onError: () => {
      toast.error("Failed to delete the chatbot."); // Error handling
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this chatbot?")) {
        deleteMutation.mutate(String(chatbot.id)); // Convert to string
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto h-full">
      <Link to={`/hub/${chatbot.id}`}>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={chatbot.avatar}
              alt={chatbot.latest_version.name}
            />
            <AvatarFallback>
              {chatbot.latest_version.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{chatbot.latest_version.name}</h2>
            <p className="text-sm text-muted-foreground">
              Created by @{chatbot.latest_version.modified_by}
            </p>
          </div>
        </CardHeader>
      </Link>
      <CardContent>
        <p className="text-sm">
          "{chatbot.latest_version.prompt.substring(0, 100)}"
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              likeMutation.mutate({
                action: "like",
                id: chatbot.id,
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
            {chatbot.likes}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              likeMutation.mutate({
                action: "report",
                id: chatbot.id,
                type: "chatbot",
              })
            }
          >
            <Flag className="h-4 w-4" />
            <span className="sr-only">Report</span>
          </Button>
          <span
            className="inline-flex items-center text-sm text-muted-foreground"
            aria-label="Report count"
          >
            {chatbot.reports}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => navigate(`/chatbot/${chatbot.id}`)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              shareModel.onOpen({
                title: `Share Chatbot ${chatbot.latest_version.name} Powered by Bot Verse`,
                shareUrl: `http://localhost:5000/hub/${chatbot.id}`,
              })
            }
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button
            variant="destructive" // Use a destructive variant for delete
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-2 w-2" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
