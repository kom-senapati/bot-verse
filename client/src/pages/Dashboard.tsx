import { useAuth } from "@/contexts/auth-context";
import Navbar from "../components/Navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDashboardData, publishChatbot } from "@/lib/queries";
import { imageSrc } from "@/lib/utils";
import Separator from "@/components/Separator";
import { Button } from "@/components/ui/button";
import {
  useCreateChatbotModal,
  useDeleteChatbotModal,
  useUpdateChatbotModal,
} from "@/stores/modal-store";
import {
  Edit,
  GlobeIcon,
  GlobeLockIcon,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const createChatbotModal = useCreateChatbotModal();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });

  useCopilotReadable({
    description:
      "The current dashboard information with all user's chatbots and other information",
    value: data,
  });

  if (loading || user == null) {
    return <LoadingDashboard />;
  }

  return (
    <>
      <Navbar />
      <div className="bg-light dark:bg-dark p-6 rounded-lg mt-4 w-full flex flex-col items-center container">
        <h2 className="text-3xl font-bold mb-6 dark:text-white">
          Welcome 👋, <span className="text-blue-600">{user.name}</span>!
        </h2>
        {isLoading && <LoadingDashboard />}
        {data && (
          <>
            {/* Welcome  */}
            <div className="flex gap-6">
              <div className="flex flex-col gap-6 flex-1">
                <div className="flex gap-6">
                  <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
                    <h3 className="text-xl font-semibold dark:text-white">
                      Chatbot of the Day
                    </h3>
                    <p
                      id="chatbot-name"
                      className="text-lg dark:text-neutral-300"
                    >
                      {data.chatbot_of_the_day.name}
                    </p>
                    <p
                      id="chatbot-description"
                      className="dark:text-neutral-400"
                    >
                      {data.chatbot_of_the_day.prompt}
                    </p>
                  </div>

                  <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
                    <h3 className="text-xl font-semibold dark:text-white">
                      Message of the Day
                    </h3>
                    <blockquote
                      id="message-of-the-day"
                      className="italic text-lg dark:text-neutral-300"
                    >
                      "{data.quote_of_the_day}"
                    </blockquote>
                  </div>
                </div>

                <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
                  <h3 className="text-xl font-semibold dark:text-white">
                    Tip of the Day
                  </h3>
                  <blockquote
                    id="tip-of-the-day"
                    className="italic text-lg dark:text-neutral-300"
                  >
                    "{data.tip}"
                  </blockquote>
                </div>
              </div>

              <div className="border border-lighter dark:border-darker p-4 rounded-lg shadow-sm flex-1">
                <h3 className="text-xl font-semibold dark:text-white">
                  Image of the Day
                </h3>
                <img
                  id="image-of-the-day"
                  className="rounded-lg shadow-md w-full h-auto max-h-60 object-cover"
                  src={imageSrc(data.image_of_the_day?.prompt)}
                  alt="Image of the Day"
                />
                <p id="image-title" className="dark:text-neutral-300 mt-2">
                  {data.image_of_the_day?.prompt || "Nature"}
                </p>
              </div>
            </div>
            <Separator />
            <h2 className="text-2xl font-bold mb-6 p-3">Your Chatbots</h2>
            {data.bots.length == 0 ? (
              <div className="mt-8 flex items-center space-x-2">
                <p className="text-center">No chatbots! </p>
                <Button onClick={() => createChatbotModal.onOpen()}>
                  Create One
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3">
                {data.bots.map((bot) => (
                  <ChatbotCard key={bot.prompt} chatbot={bot} />
                ))}
              </div>
            )}
            <Separator />
            <h2 className="text-2xl font-bold mb-6 p-3">System Chatbots</h2>
            {data.systemBots.length == 0 ? (
              <div className="mt-8 flex items-center space-x-2 ">
                <p className="text-center">No chatbots! </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3">
                {data.systemBots.map((bot) => (
                  <ChatbotCard key={bot.prompt} chatbot={bot} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

function ChatbotCard({ chatbot }: { chatbot: Chatbot }) {
  const deleteModal = useDeleteChatbotModal();
  const updateModal = useUpdateChatbotModal();
  const rq = useQueryClient();
  const mutation = useMutation({
    mutationFn: publishChatbot,
    onSuccess: () => rq.invalidateQueries({ queryKey: ["dashboard"] }),
  });

  return (
    <>
      <div className="min-w-80 bg-light dark:bg-dark p-6 rounded-lg transition-all drop-shadow hover:shadow border border-lighter dark:border-darker flex flex-col justify-between h-64">
        <div>
          <div className="flex items-center space-x-2">
            <img
              src={chatbot.avatar}
              alt={`${chatbot.name}'s avatar`}
              className="w-10 h-10 border dark:border-darker rounded-full mr-3"
            />
            <h3 className="text-xl font-semibold truncate">{chatbot.name}</h3>
          </div>
          <p className="text-neutral-600 mt-2 overflow-hidden text-ellipsis">
            "{chatbot.prompt.substring(0, 100)}..."
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center text-2xl">
          <Link
            to={`/chatbot/${chatbot.id}`}
            className="text-blue-500 hover:text-blue-600 transition duration-300 p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-800/20"
          >
            <MessageCircle />
          </Link>
          {chatbot.generated_by !== "system" && (
            <>
              <button
                className="text-yellow-500 hover:text-yellow-600 transition duration-300 p-2 rounded hover:bg-yellow-100 dark:hover:bg-yellow-700/10 dark:text-yellow-400 dark:hover:text-yellow-300"
                title="Update"
                onClick={() =>
                  updateModal.onOpen({
                    id: chatbot.id,
                    prevName: chatbot.name,
                    prevPrompt: chatbot.prompt,
                  })
                }
              >
                <Edit />
              </button>
              {chatbot.public ? (
                <button
                  className="text-red-500 hover:text-red-600 transition duration-300 p-2 rounded hover:bg-red-100 dark:hover:bg-red-700/10 dark:text-red-400 dark:hover:text-red-300"
                  title="Unpublish"
                  onClick={() => mutation.mutate(chatbot.id)}
                >
                  <GlobeLockIcon />
                </button>
              ) : (
                <button
                  className="text-green-500 hover:text-green-600 transition duration-300 p-2 rounded hover:bg-green-100 dark:hover:bg-green-700/10 dark:text-green-400 dark:hover:text-green-300"
                  title="Publish"
                  onClick={() => mutation.mutate(chatbot.id)}
                >
                  <GlobeIcon />
                </button>
              )}
              <button
                className="text-red-500 hover:text-red-600 transition duration-300 p-2 rounded hover:bg-red-100 dark:hover:bg-red-700/10 dark:text-red-400 dark:hover:text-red-300"
                title="Delete"
                onClick={() =>
                  deleteModal.onOpen({
                    id: chatbot.id,
                  })
                }
              >
                <Trash2 />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function LoadingDashboard() {
  return (
    <div className="p-6 rounded-lg mt-4 w-full flex flex-col items-center container h-full">
      <Skeleton className="h-10 w-[40%] rounded-xl my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
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
