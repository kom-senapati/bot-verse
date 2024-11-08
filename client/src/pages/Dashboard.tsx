import { useAuth } from "@/contexts/auth-context";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/queries";
import Separator from "@/components/Separator";
import { useCreateChatbotModal } from "@/stores/modal-store";
import Footer from "@/components/Footer";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatbotCard } from "@/components/ChatbotCard";
import BotsLoading from "@/components/BotsLoading";
import { imageSrc, welcomeMessages } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import transition from "@/components/transition";

function DashboardPage() {
  const { user, loading } = useAuth();
  const createChatbotModal = useCreateChatbotModal();
  const { t } = useTranslation();
  const {
    data: botsData,
    isLoading: botsLoading,
    error: botsError,
  } = useQuery({
    queryKey: ["my_bots"],
    queryFn: () => fetchData({ queues: ["my_bots"] }),
  });

  const {
    data: systemBotsData,
    isLoading: systemBotsLoading,
    error: systemBotsError,
  } = useQuery({
    queryKey: ["system_bots"],
    queryFn: () => fetchData({ queues: ["system_bots"] }),
  });
  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
  } = useQuery({
    queryKey: ["trend_today"],
    queryFn: () => fetchData({ queues: ["trend_today"] }),
  });

  const { messageOfTheDay, tip } = welcomeMessages();
  useCopilotReadable({
    description:
      "The current dashboard information with all user's chatbots and other information",
    value: botsData,
  });

  return (
    <>
      <Navbar />
      <div className="bg-light dark:bg-dark p-6 rounded-lg mt-4 w-full flex flex-col items-center container">
        {loading || user == null ? (
          <Skeleton className="h-10 w-[40%] rounded-xl my-2" />
        ) : (
          <h2 className="text-3xl font-bold mb-6">
            {t("dashboard.welcome")} 👋, <span>{user.name}</span>!
          </h2>
        )}

        <>
          <div className="flex gap-6">
            <div className="flex flex-col gap-6 flex-1">
              <div className="flex gap-6">
                <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {t("dashboard.chatbot_of_day")}
                  </h3>
                  {trendsLoading ? (
                    <>
                      <Skeleton className="h-10 w-[35%] rounded-xl my-2" />
                      <Skeleton className="h-10 w-[40%] rounded-xl my-2" />
                    </>
                  ) : trendsData ? (
                    <>
                      <ChatbotCard
                        chatbot={trendsData.trend_today!.chatbot}
                        queryKeys={["trend_today"]}
                        className="bg-transparent border-0"
                      />
                    </>
                  ) : (
                    <div className="col-span-1 text-red-500 text-center">
                      {trendsError?.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
                <h3 className="text-xl font-semibold">
                  {t("dashboard.tip_of_day")}
                </h3>
                <blockquote id="tip-of-the-day" className="italic text-lg">
                  "{tip}"
                </blockquote>
              </div>
              <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
                <h3 className="text-xl font-semibold">
                  {t("dashboard.message_of_day")}
                </h3>
                <blockquote id="message-of-the-day" className="italic text-lg">
                  "{messageOfTheDay}"
                </blockquote>
              </div>
            </div>

            <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
              <h3 className="text-xl font-semibold">
                {t("dashboard.image_of_day")}
              </h3>
              {trendsLoading ? (
                <>
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <Skeleton className="h-10 w-[40%] rounded-xl my-2" />
                </>
              ) : trendsData ? (
                <>
                  <div className="relative aspect-square">
                    <img
                      src={imageSrc(
                        trendsData.trend_today!.image?.prompt || ""
                      )}
                      className="rounded-lg shadow-md w-full"
                      alt="Image of the Day"
                    />
                  </div>

                  <p id="image-title" className="mt-2">
                    {trendsData.trend_today?.image?.prompt || "Nature"}
                  </p>
                </>
              ) : (
                <div className="col-span-1 text-red-500 text-center">
                  {trendsError?.message}
                </div>
              )}
            </div>
          </div>
          <Separator />
          <h2 className="text-2xl font-bold mb-6 p-3">
            {t("dashboard.your_chatbots")}
          </h2>

          {botsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3">
              <BotsLoading count={3} />
            </div>
          ) : botsError ? (
            <div className="col-span-1 text-red-500 text-center">
              {botsError?.message}
            </div>
          ) : botsData && botsData.my_bots!.length == 0 ? (
            <div
              onClick={() => createChatbotModal.onOpen()}
              className="h-72 max-w-sm rounded-lg border-[10px] border-dashed shadow flex items-center justify-center hover:cursor-pointer hover:border-primary/10 transition-colors"
            >
              <p className="text-muted text-2xl font-bold font-mono hover:text-muted/10 transition-colors">
                {t("dashboard.new_chatbot")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3">
              <div
                onClick={() => createChatbotModal.onOpen()}
                className="h-72 max-w-sm rounded-lg border-[10px] border-dashed shadow flex items-center justify-center hover:cursor-pointer hover:border-primary/10 transition-colors"
              >
                <p className="text-muted text-2xl font-bold font-mono hover:text-muted/10 transition-colors">
                  {t("dashboard.new_chatbot")}
                </p>
              </div>
              {botsData?.my_bots!.map((bot) => (
                <ChatbotCard
                  queryKeys={["my_bots"]}
                  key={bot.latest_version.prompt}
                  chatbot={bot}
                />
              ))}
            </div>
          )}

          <Separator />
          <h2 className="text-2xl font-bold mb-6 p-3">
            {t("dashboard.system_chatbots")}
          </h2>
          {systemBotsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3">
              <BotsLoading />
            </div>
          ) : systemBotsError ? (
            <div className="col-span-1 text-red-500 text-center">
              {systemBotsError?.message}
            </div>
          ) : systemBotsData && systemBotsData?.system_bots!.length == 0 ? (
            <div className="mt-8 flex items-center space-x-2">
              <p className="text-center">{t("dashboard.no")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3">
              {systemBotsData?.system_bots!.map((bot) => (
                <ChatbotCard
                  queryKeys={["system_bots"]}
                  key={bot.latest_version.prompt}
                  chatbot={bot}
                />
              ))}
            </div>
          )}
        </>
      </div>
      <Footer />
    </>
  );
}

export default transition(DashboardPage);
