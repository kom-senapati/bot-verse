import BotsLoading from "@/components/BotsLoading";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { fetchData, publishObj } from "@/lib/queries";
import {
  useDeleteChatbotModal,
  useUpdateChatbotModal,
} from "@/stores/modal-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag, Heart, Pencil, Send, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyChatbotsPage() {
  const { loading, user } = useAuth();
  const qc = useQueryClient();
  const deleteModal = useDeleteChatbotModal();
  const updateModal = useUpdateChatbotModal();
  const {
    data: botsData,
    isLoading: botsLoading,
    error: botsError,
  } = useQuery({
    queryKey: ["my_bots"],
    queryFn: () => fetchData({ queues: ["my_bots"], uid: user?.id }),
    enabled: !!user,
  });

  const publishMutation = useMutation({
    mutationFn: publishObj,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my_bots"] }),
  });

  if (user == null || loading) {
    return (
      <div className="flex items-center justify-center w-screen min-h-screen">
        <div className="grid grid-flow-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 w-full">
          <BotsLoading />
        </div>
      </div>
    );
  }
  // Calculate analytics
  const totalLikes =
    botsData?.my_bots?.reduce((sum, bot) => sum + bot.likes, 0) || 0;
  const totalReports =
    botsData?.my_bots?.reduce((sum, bot) => sum + bot.reports, 0) || 0;
  const topRankedBot = (botsData?.my_bots || []).reduce(
    (topBot, currentBot) => {
      return currentBot.likes > (topBot?.likes || 0) ? currentBot : topBot;
    },
    botsData?.my_bots?.[0]
  );

  return (
    <div>
      <Navbar />

      <div className="min-h-screen container mt-4 w-full flex flex-col items-center">
        <Card className="w-full mb-6 max-w-3xl">
          <CardHeader className="p-4">
            <h3 className="text-xl font-semibold">Analytics Summary</h3>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-medium">Total Likes:</span>
              <span>{totalLikes}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Flag className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Total Reports:</span>
              <span>{totalReports}</span>
            </div>
            {topRankedBot && (
              <div className="text-center">
                <Avatar className="w-16 h-16 mb-2 mx-auto">
                  <AvatarImage
                    src={topRankedBot.avatar}
                    alt={topRankedBot.latest_version.name}
                  />
                  <AvatarFallback>
                    {topRankedBot.latest_version.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">Top Ranked Bot</p>
                <p className="text-lg font-semibold">
                  {topRankedBot.latest_version.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Likes: {topRankedBot.likes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <h2 className="text-2xl font-semibold mb-6 p-3">My Images</h2>
        <div className="grid grid-flow-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 w-full">
          {botsLoading ? (
            <BotsLoading />
          ) : botsError ? (
            <div className="col-span-1 text-red-500 text-center">
              {botsError?.message}
            </div>
          ) : botsData && botsData.my_bots!.length > 0 ? (
            botsData.my_bots!.map((chatbot) => (
              <Card className="w-full max-w-sm mx-auto h-fit">
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
                      <h2 className="text-2xl font-bold">
                        {chatbot.latest_version.name}
                      </h2>
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
                  <div className="flex space-x-4">
                    <div className="flex justify-center items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      <span>{chatbot.likes}</span>
                    </div>
                    <div className="flex justify-center items-center">
                      <Flag className="h-4 w-4 mr-2" />
                      <span>{chatbot.reports}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={chatbot.public ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        publishMutation.mutate({
                          id: chatbot.id,
                          obj: "chatbot",
                        })
                      }
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {chatbot.public ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() =>
                        updateModal.onOpen({
                          id: chatbot.id,
                          prevName: chatbot.latest_version.name,
                          prevPrompt: chatbot.latest_version.prompt,
                          prevCategory: chatbot.category,
                          versions: [],
                        })
                      }
                    >
                      <Pencil className="h-2 w-2" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-full"
                      onClick={() =>
                        deleteModal.onOpen({
                          id: chatbot.id,
                          obj: "chatbot",
                          queryKeys: ["my_bots"],
                        })
                      }
                    >
                      <Trash2 className="h-2 w-2" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-1 text-center">No Images available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
