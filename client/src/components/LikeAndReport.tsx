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
  type: "image" | "chatbot" | "user";
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
          className="relative text-blue-500 hover:text-blue-600 transition duration-300 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/20 like-btn"
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
          {/* Display likes count on top of the button */}
          <span className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {likes}
          </span>
        </button>
      </div>
      <div className="flex items-center">
        <button
          className="relative text-red-500 hover:text-red-600 transition duration-300 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-700/10 dark:text-red-400 dark:hover:text-red-300"
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
          {/* Display reports count on top of the button */}
          <span className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {reports}
          </span>
        </button>
      </div>
    </>
  );
}
