import {
  Edit,
  GlobeIcon,
  GlobeLockIcon,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LikeAndReport } from "./LikeAndReport";
import {
  useDeleteChatbotModal,
  useUpdateChatbotModal,
} from "@/stores/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishChatbot } from "@/lib/queries";

export function ChatbotCard({
  chatbot,
  queryKeys,
  userId,
}: {
  chatbot: Chatbot;
  queryKeys: string[];
  userId?: number;
}) {
  const showActions = userId === chatbot.user_id;

  const deleteModal = useDeleteChatbotModal();
  const updateModal = useUpdateChatbotModal();
  const rq = useQueryClient();
  const mutation = useMutation({
    mutationFn: publishChatbot,
    onSuccess: () => rq.invalidateQueries({ queryKey: queryKeys }),
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
          {showActions ? (
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
          ) : (
            <LikeAndReport
              id={chatbot.id}
              likes={chatbot.likes}
              reports={chatbot.reports}
              type="chatbot"
              queryKeys={queryKeys}
            />
          )}
        </div>
      </div>
    </>
  );
}
