import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { fetchData, fetchProfileData, likeAndReport } from "@/lib/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Activity,
  Code,
  Edit2,
  Flag,
  Heart,
  LogOut,
  Settings,
} from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import { useSettingsModal, useUpdateProfileModal } from "@/stores/modal-store";
import { ChatbotCard } from "@/components/ChatbotCard";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { username } = useParams();
  const profileUpdateModal = useUpdateProfileModal();
  const settingsModal = useSettingsModal();
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const { user: currentUser, logout } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchProfileData(username!),

    retry() {
      return false;
    },
  });

  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: likeAndReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user", username] }),
  });

  useEffect(() => {
    if (data?.user?.id && !userId) {
      setUserId(data.user.id);
    }
  }, [data, userId]);

  const {
    data: botsData,
    isLoading: botsLoading,
    error: botsError,
  } = useQuery({
    queryKey: ["user_bots"],
    queryFn: () => fetchData({ queues: ["user_bots"], uid: userId }),
    enabled: !!userId,
  });

  if (isError && (error as AxiosError).response?.status === 404) {
    return <Navigate to="/404" />; // Redirect to the 404 page
  }

  if (currentUser == null || isLoading || !data) {
    return <LoadingProfilePage />;
  }

  const { user, contribution_score } = data;
  const self = currentUser.username == username;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 space-y-8">
        {self && (
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-semibold">Profile</h2>
            <div className="flex space-x-2 mr-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  profileUpdateModal.onOpen({
                    prevName: user.name,
                    prevBio: user.bio,
                    prevUsername: user.username,
                  })
                }
                className="rounded-full"
              >
                <Edit2 className="w-20 h-20" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() => settingsModal.onOpen()}
              >
                <Settings className="w-20 h-20" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => logout()}
                className="rounded-full"
              >
                <LogOut className="w-20 h-20" />
              </Button>
            </div>
          </div>
        )}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <img className="w-24 h-24 rounded-full" src={user.avatar} />

              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <p>{user.bio}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Badge variant="outline">
                    <Activity className="w-4 h-4 mr-1" />
                    Joined {moment(user.created_at).fromNow()}
                  </Badge>
                  <Badge variant="outline">
                    <Code className="w-4 h-4 mr-1" />
                    {contribution_score} Contributions
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-row mt-3 -mb-2 justify-end">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() =>
                    mutation.mutate({
                      action: "like",
                      id: user.id,
                      type: "user",
                    })
                  }
                >
                  <Heart className={`h-4 w-4`} />
                  <span>{user.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() =>
                    mutation.mutate({
                      action: "report",
                      id: user.id,
                      type: "user",
                    })
                  }
                >
                  <Flag className="h-4 w-4 mr-2" />
                  <span>{user.reports}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-flow-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 w-full">
          {botsLoading ? (
            <ChatbotLoading />
          ) : botsError ? (
            <div className="col-span-1 text-red-500 text-center">
              {botsError?.message}
            </div>
          ) : botsData && botsData.user_bots!.length > 0 ? (
            botsData.user_bots!.map((item) => (
              <ChatbotCard
                chatbot={item}
                queryKeys={["user_bots"]}
                key={item.name}
              />
            ))
          ) : (
            <div className="col-span-1 text-center">No bots available.</div>
          )}
        </div>
      </div>
    </>
  );
}

function LoadingProfilePage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Profile Header Loading */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[40%] rounded-lg" />
        <div className="flex space-x-2 mr-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Profile Card Loading */}
      <Skeleton className="h-64 rounded-lg" />

      {/* User Info Loading */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-2 text-center md:text-left w-full">
          <Skeleton className="h-6 w-[60%] rounded-lg" />
          <Skeleton className="h-4 w-[40%] rounded-lg" />
          <Skeleton className="h-4 w-[80%] rounded-lg" />
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Like and Report Loading */}
      <div className="flex flex-row mt-3 -mb-2 justify-end">
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>

      {/* User Bots Loading */}
      <div className="grid grid-flow-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 w-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function ChatbotLoading() {
  return Array.from({ length: 3 }).map((_, i) => (
    <div key={i} className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ));
}
