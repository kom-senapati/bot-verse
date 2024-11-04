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
        <Button onClick={() => navigate("/dashboard")}>{t("leaderboard_page.goto")}</Button>
      </div>
    );
  }

  // Sort the leaderboard by points in descending order
  const leaderboard = data.leaderboard.sort((a, b) => b.points - a.points);
  const topUsers = leaderboard.slice(0, 3);

  return (
    <div className="container mx-auto p-6 h-full min-h-screen">
      <Navbar />
      <h1 className="text-4xl font-bold my-6 text-center">
        {t("navbar.leaderboard")}
      </h1>

      {/* Top Leader Section */}
      <div className="flex justify-around my-6">
        {topUsers.map((user, idx) => (
          <div key={user.id} className="p-4 bg-white shadow rounded-lg text-center w-1/4">
            <h3 className="text-2xl font-bold">
              {idx + 1}. {user.name}
            </h3>
            <p className="text-lg font-semibold">{user.points} pts</p>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="table-container overflow-x-auto mt-6">
        <table className="w-full text-left bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-4">Rank</th>
              <th>{t("navbar.profile")}</th>
              <th>{t("navbar.username")}</th>
              <th>{t("points")}</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, idx) => (
              <tr key={user.id} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="p-4 font-medium">{idx + 1}</td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">@{user.username}</td>
                <td className="p-4">{user.points} pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}