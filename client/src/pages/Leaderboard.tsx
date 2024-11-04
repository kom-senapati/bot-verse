import { fetchData } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchData({
        queues: ["leaderboard"],
      }),
    queryKey: ["leaderboard"],
  });

  const navigate = useNavigate();

  if (isLoading) {
    // Loading skeleton
    return (
      <div className="p-6 space-y-4 flex justify-center items-center">
        <div className="h-8 rounded w-48"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.leaderboard || data.leaderboard.length === 0) {
    // No data found, button redirects to dashboard
    return (
      <div className="text-center p-6 space-y-4">
        <p>{t("leaderboard_page.no")}</p>
        <Button onClick={() => navigate("/dashboard")}>
          {t("leaderboard_page.goto")}
        </Button>
      </div>
    );
  }

  const { leaderboard } = data;

  return (
    <div className="container mx-auto p-6 h-full min-h-screen">
      <Navbar />
      <h1 className="text-4xl font-bold my-6 text-center">
        {t("navbar.leaderboard")}
      </h1>
      <div className="space-y-4">
        {leaderboard.map((user, idx: number) => (
          <div
            key={user.id}
            className="p-4 bg-primary/10 shadow rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              <span className="text-xl font-semibold">{idx + 1}.</span>
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-lg font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </div>
            <p className="text-xl font-semibold">
              {user.contribution_score} pts
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
