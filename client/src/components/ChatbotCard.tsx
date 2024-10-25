import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { LikeAndReport } from "./LikeAndReport";

export function ChatbotCard({
  chatbot,
  queryKeys,
}: {
  chatbot: Chatbot;
  queryKeys: string[];
}) {
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
            className="text-primary hover:text-primary/90 transition duration-300 p-2 rounded-full hover:bg-primary/10"
          >
            <MessageCircle />
          </Link>

          <LikeAndReport
            id={chatbot.id}
            likes={chatbot.likes}
            reports={chatbot.reports}
            type="chatbot"
            queryKeys={queryKeys}
          />
        </div>
      </div>
    </>
  );
}
