import { likeAndReport } from "@/lib/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, ThumbsUp } from "lucide-react";
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
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: likeAndReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys }),
  });

  return (
    <>
      <div className="flex items-center">
        <button
          type="button"
          className="relative text-primary hover:text-primary/90 transition duration-300 p-2 rounded-full hover:bg-primary/20"
          title="Like"
          onClick={() =>
            mutation.mutate({
              action: "like",
              id,
              type,
            })
          }
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          {/* Display likes count on top of the button */}
          <span
            className="inline-flex items-center text-sm text-muted-foreground"
            aria-label="Like count"
          >
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
          <span className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {reports}
          </span>
        </button>
      </div>
    </>
  );
}
