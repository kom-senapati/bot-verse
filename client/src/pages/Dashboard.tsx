import { useAuth } from "@/contexts/auth-context";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/queries";
import Separator from "@/components/Separator";
import { Button } from "@/components/ui/button";
import { useCreateChatbotModal } from "@/stores/modal-store";
import Footer from "@/components/Footer";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatbotCard } from "@/components/ChatbotCard";
import BotsLoading from "@/components/BotsLoading";
import { imageSrc, welcomeMessages } from "@/lib/utils";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const createChatbotModal = useCreateChatbotModal();

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
            Welcome 👋, <span>{user.name}</span>!
          </h2>
        )}

        <>
          <div className="flex gap-6">
            <div className="flex flex-col gap-6 flex-1">
              <div className="flex gap-6">
                <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
                  <h3 className="text-xl font-semibold ">Chatbot of the Day</h3>
                  {trendsLoading ? (
                    <>
                      <Skeleton className="h-10 w-[35%] rounded-xl my-2" />
                      <Skeleton className="h-10 w-[40%] rounded-xl my-2" />
                    </>
                  ) : trendsData ? (
                    <>
                      <p className="text-lg">
                        {trendsData.trend_today!.chatbot.name}
                      </p>
                      <p className="">
                        {trendsData.trend_today!.chatbot.prompt}
                      </p>
                    </>
                  ) : (
                    <div className="col-span-1 text-red-500 text-center">
                      {trendsError?.message}
                    </div>
                  )}
                </div>

                <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
                  <h3 className="text-xl font-semibold">Message of the Day</h3>
                  <blockquote
                    id="message-of-the-day"
                    className="italic text-lg"
                  >
                    "{messageOfTheDay}"
                  </blockquote>
                </div>
              </div>

              <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
                <h3 className="text-xl font-semibold">Tip of the Day</h3>
                <blockquote id="tip-of-the-day" className="italic text-lg">
                  "{tip}"
                </blockquote>
              </div>
            </div>

            <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
              <h3 className="text-xl font-semibold">Image of the Day</h3>
              {trendsLoading ? (
                <>
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <Skeleton className="h-10 w-[40%] rounded-xl my-2" />
                </>
              ) : trendsData ? (
                <>
                  <img
                    id="image-of-the-day"
                    className="rounded-lg shadow-md w-full h-auto max-h-60 object-cover"
                    src={imageSrc(trendsData.trend_today!.image.prompt)}
                    alt="Image of the Day"
                  />
                  <p id="image-title" className="mt-2">
                    {trendsData.trend_today!.image.prompt || "Nature"}
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
          <h2 className="text-2xl font-bold mb-6 p-3">Your Chatbots</h2>

          {botsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3">
              <BotsLoading count={3} />
            </div>
          ) : botsError ? (
            <div className="col-span-1 text-red-500 text-center">
              {botsError?.message}
            </div>
          ) : botsData && botsData.my_bots!.length == 0 ? (
            <div className="mt-8 flex items-center space-x-2">
              <p className="text-center">No chatbots! </p>
              <Button onClick={() => createChatbotModal.onOpen()}>
                Create One
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3">
              {botsData?.my_bots!.map((bot) => (
                <ChatbotCard
                  queryKeys={["my_bots"]}
                  userId={user?.id}
                  key={bot.prompt}
                  chatbot={bot}
                />
              ))}
            </div>
          )}

          <Separator />
          <h2 className="text-2xl font-bold mb-6 p-3">System Chatbots</h2>
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
              <p className="text-center">No chatbots! </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3">
              {systemBotsData?.system_bots!.map((bot) => (
                <ChatbotCard
                  queryKeys={["system_bots"]}
                  userId={user?.id}
                  key={bot.prompt}
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
