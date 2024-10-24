import Separator from "@/components/Separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authHeaders, deleteAllChats, fetchChatbotData } from "@/lib/queries";
import { messageSchema } from "@/lib/schemas";
import { SERVER_URL } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Loader2, SendIcon, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import Markdown from "react-markdown";

export default function ChatbotPage() {
  const { id } = useParams();
  if (!id) return null;

  const { data } = useQuery({
    queryKey: ["chatbot", id],
    queryFn: () => fetchChatbotData(id),
  });
  const singleClickTimeout = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false); // Loading state for request
  const rq = useQueryClient();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      query: "",
    },
  });

  const mutation = useMutation({
    mutationFn: deleteAllChats,
    onSuccess: () => rq.invalidateQueries({ queryKey: ["chatbot", id] }),
  });

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    try {
      setLoading(true);
      const response = await axios.post(
        `${SERVER_URL}/api/chatbot/${id}`,
        values,
        { headers: authHeaders }
      );
      if (response.data?.success) {
        form.reset();
        rq.invalidateQueries({ queryKey: ["chatbot", id] });
      } else {
        throw new Error(response.data?.message || "failed. Please try again.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      toast.error(errorMessage);
      console.log("[MESSAGING_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col border-x-2 border-lighter dark:border-darker max-w-7xl mx-auto rounded-sm dark:bg-dark bg-light dark:text-dark h-screen">
      <div className="flex items-center justify-between m-3">
        <div className="flex items-center space-x-2">
          <Link
            to={"/dashboard"}
            className="shadow bg-blue-500 text-white rounded-full  transition-colors hover:bg-blue-600"
          >
            <ArrowLeft className="w-10 h-10 p-2" />
          </Link>
          <img
            src={data?.bot.avatar}
            alt={`${data?.bot.name}'s avatar`}
            className="w-10 h-10 border rounded-full dark:border-darker mr-3"
          />
          <h1 className="text-4xl font-extrabold dark:text-dark text-center">
            {data?.bot.name}
          </h1>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              if (singleClickTimeout.current) {
                clearTimeout(singleClickTimeout.current); // If double click happens, clear the single-click action
              }

              singleClickTimeout.current = setTimeout(() => {
                toast.success("Double Click to delete all messages.");
              }, 200); // Set a delay to check if it's a single or double click
            }}
            onDoubleClick={() => {
              if (singleClickTimeout.current) {
                clearTimeout(singleClickTimeout.current); // Clear single click timeout on double click
              }
              mutation.mutate(id); // Trigger the double-click delete action
            }}
            className="rounded-full text-red-500 hover:text-red-600 transition duration-300 p-2 hover:bg-red-100 dark:hover:bg-red-700/10 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 />
          </button>
        </div>
      </div>
      <Separator className="my-0" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 h-full no-scrollbar">
        {data ? (
          <>
            {data.chats.map((chat) => (
              <>
                <div className="flex justify-end">
                  <div className="max-w-xs bg-blue-500 text-white rounded-xl p-4 drop-shadow shadow">
                    <p className="text-sm">{chat.user_query}</p>
                  </div>
                </div>
                <div className="flex justify-start items-center space-x-2 mb-2">
                  <div className="max-w-md bg-white dark:bg-dark dark:text-dark/90 text-gray-900 rounded-xl p-4 drop-shadow-md shadow border border-gray-100 dark:border-darker flex flex-col">
                    <p className="text-sm flex-1">
                      <Markdown>{chat.response}</Markdown>
                    </p>
                  </div>
                </div>
              </>
            ))}
          </>
        ) : (
          <Loading />
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full space-x-3 px-3 py-1 border-t dark:border-darker border-lighter"
        >
          <FormField
            control={form.control}
            disabled={loading}
            name="query"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Type your message.."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size={"icon"}
            variant={"outline"}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <SendIcon />}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function Loading() {
  return (
    <div>
      <p className="text-muted-foreground">Loading prevoius data..</p>
    </div>
  );
}
