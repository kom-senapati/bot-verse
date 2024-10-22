import Navbar from "@/components/Navbar";
import { fetchHubData, likeAndReport } from "@/lib/queries";
import { imageSrc } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, Download, Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function HubPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["hub"],
    queryFn: fetchHubData,
  });

  return (
    <>
      <Navbar />
      <div className="bg-light dark:bg-dark p-6 rounded-lg mt-4 w-full flex flex-col items-center">
        {isLoading && <p>Loading wait..</p>}
        {data && (
          <>
            <h2 className="text-2xl font-semibold mb-6 p-3">
              Chatbots and AI Images Hub
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3">
              {data.bots.map((bot) => (
                <ChatbotCard chatbot={bot} />
              ))}
              {data.images.map((image) => (
                <ImageCard image={image} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export function ChatbotCard({ chatbot }: { chatbot: Chatbot }) {
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
            "{chatbot.prompt.substring(0, 100)}"
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center text-2xl">
          <Link
            to={`/chatbot/${chatbot.id}`}
            className="text-blue-500 hover:text-blue-600 transition duration-300 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/20"
          >
            <MessageCircle />
          </Link>

          <LikeAndReport
            id={chatbot.id}
            likes={chatbot.likes}
            reports={chatbot.reports}
            type="chatbot"
          />
        </div>
      </div>
    </>
  );
}

export function ImageCard({ image }: { image: ImageGen }) {
  return (
    <>
      <div className="flex justify-start items-start space-x-2 mb-2">
        <div className="max-w-md bg-white dark:bg-dark dark:text-dark/90 text-gray-900 rounded-xl p-4 drop-shadow-md shadow border border-gray-100 dark:border-darker flex flex-col">
          <img
            className="rounded-md"
            src={imageSrc(image.prompt)}
            alt={image.prompt}
          />
          <p className="text-center mt-2">"{image.prompt.substring(0, 100)}"</p>
          <div className="flex justify-between mt-2">
            <a
              type="button"
              className="rounded-full text-blue-500 hover:text-blue-600 transition duration-300 p-2 hover:bg-blue-100 dark:hover:bg-blue-800/20 like-btn"
              title="Download"
              download
              target="_blank"
              href={imageSrc(image.prompt)}
            >
              <Download />
            </a>
            <LikeAndReport
              id={image.id}
              likes={image.likes}
              reports={image.reports}
              type="image"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function LikeAndReport({
  id,
  type,
  likes,
  reports,
}: {
  id: number;
  likes: number;
  reports: number;
  type: "image" | "chatbot";
}) {
  const rq = useQueryClient();

  const mutation = useMutation({
    mutationFn: likeAndReport,
    onSuccess: () => rq.invalidateQueries({ queryKey: ["hub"] }),
  });

  return (
    <>
      <div className="flex items-center">
        <button
          type="button"
          className="text-blue-500 hover:text-blue-600 transition duration-300 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/20 like-btn"
          title="Like"
          onClick={() =>
            mutation.mutate({
              action: "like",
              id,
              type,
            })
          }
        >
          <Heart />
        </button>
        <span className="text-sm text-gray-500 ml-2">{likes}</span>
      </div>

      <div className="flex items-center">
        <button
          className="text-red-500 hover:text-red-600 transition duration-300 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-700/10 dark:text-red-400 dark:hover:text-red-300"
          title="Report"
          onClick={() =>
            mutation.mutate({
              action: "report",
              id,
              type,
            })
          }
        >
          <Ban />
        </button>

        <span className="text-sm text-gray-500 ml-2">{reports}</span>
      </div>
    </>
  );
}
