import { likeAndReport } from "@/lib/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, Heart } from "lucide-react";

export function LikeAndReport({
  id,
  type,
  likes,
  reports,
  queryKeys,
}: {
  id: number;
  likes: number;
  reports: number;
  type: "image" | "chatbot";
  queryKeys: string[];
}) {
  const rq = useQueryClient();

  const mutation = useMutation({
    mutationFn: likeAndReport,
    onSuccess: () => rq.invalidateQueries({ queryKey: queryKeys }),
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
