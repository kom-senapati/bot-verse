import { Flag, Heart, MessageSquare, Share2 } from "lucide-react";
import { useShareModal } from "@/stores/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeAndReport } from "@/lib/queries";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function ChatbotCard({
  chatbot,
  queryKeys,
  className,
}: {
  chatbot: Chatbot;
  queryKeys: string[];
  className?: string;
}) {
  const shareModel = useShareModal();
  const rq = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const likeMutation = useMutation({
    mutationFn: likeAndReport,
    onSuccess: () => rq.invalidateQueries({ queryKey: queryKeys }),
  });

  return (
    <Card className={cn(className, "w-full max-w-sm mx-auto h-fit")}>
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
              {t("created_by")}@{chatbot.latest_version.modified_by}
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
            <span className="sr-only">{t("like")}</span>
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
            <span className="sr-only">{t("report")}</span>
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
            {t("chat")}
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
            <span className="sr-only">{t("share")}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
