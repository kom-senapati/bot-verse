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
import { deleteAllChats, fetchChatbotData } from "@/lib/queries";
import { messageSchema } from "@/lib/schemas";
import { SERVER_URL } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Loader2, Menu, SendIcon, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import Markdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/contexts/settings-context";
import { useSettingsModal, useTtsMagicModal } from "@/stores/modal-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChatbotPage() {
  const { id } = useParams();
  if (!id) return null;

  const { data } = useQuery({
    queryKey: ["chatbot", id],
    queryFn: () => fetchChatbotData(id),
  });
  const messageEl = useRef(null);
  const singleClickTimeout = useRef<NodeJS.Timeout | null>(null);
  const settingsModal = useSettingsModal();
  const ttsMagicModal = useTtsMagicModal();
  const { currentConfig } = useSettings();
  const [loading, setLoading] = useState(false); // Loading state for request
  const rq = useQueryClient();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      query: "",
    },
  });

  const mutation = useMutation({
    mutationFn: deleteAllChats,
    onSuccess: async () => {
      await rq.invalidateQueries({ queryKey: ["chatbot", id] });
    },
  });

  const scrollToBottom = useCallback(() => {
    if (messageEl.current) {
      // @ts-ignore
      messageEl.current.scrollTop = messageEl.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [data?.chats, scrollToBottom]);

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    try {
      if (!values.query.trim()) return;
      if (currentConfig == null) {
        toast.error("Please Select AI engine in settings");
        return;
      }
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
        Apikey: currentConfig.apiKey,
        engine: currentConfig.engine,
      };
      setLoading(true);
      const response = await axios.post(
        `${SERVER_URL}/api/chatbot/${id}`,
        values,
        {
          headers: authHeaders,
        }
      );
      if (response.data?.success) {
        form.reset();
        rq.invalidateQueries({ queryKey: ["chatbot", id] });
      } else {
        throw new Error(response.data?.message || "failed. Please try again.");
      }
    } catch (error: any) {
      toast.error("Check your API key and try again");
      console.log("[MESSAGING_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col border-x-2 border-lighter dark:border-darker max-w-7xl mx-auto rounded-sm dark:bg-dark bg-light dark:text-dark h-screen">
      <div className="flex items-center justify-between m-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="shadow bg-primary text-white rounded-full  transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="w-10 h-10 p-2" />
          </button>
          {!data ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <>
              <Link to={`/hub/${data?.bot.id}`} className="flex">
                <img
                  src={data?.bot.avatar}
                  alt={`${data?.bot.name}'s avatar`}
                  className="w-10 h-10 border rounded-full dark:border-darker mr-3"
                />
                <h1 className="text-4xl font-extrabold dark:text-dark text-center">
                  {data?.bot.name}
                </h1>
              </Link>
            </>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => settingsModal.onOpen()}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive hover:text-destructive/90"
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
            >
              Delete All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator className="my-0" />

      <div
        id="content"
        ref={messageEl}
        className="flex-1 overflow-y-auto p-6 space-y-6 h-full no-scrollbar"
      >
        {data ? (
          <>
            {data.chats.map((chat) => (
              <>
                <div className="flex justify-end">
                  <div className="max-w-xs bg-blue-500 text-white rounded-xl p-4 drop-shadow shadow">
                    <p className="text-sm">{chat.user_query}</p>
                  </div>
                </div>
                <div className="flex justify-start items-center space-x-2">
                  <div className="max-w-md bg-white dark:bg-dark dark:text-dark/90 text-gray-900 rounded-xl p-4 drop-shadow-md shadow border border-gray-100 dark:border-darker flex flex-col">
                    <p className="text-sm flex-1">
                      <Markdown>{chat.response}</Markdown>
                    </p>
                    <div className="flex justify-end">
                      <Button
                        className="rounded-full hover:bg-primary/10"
                        variant={"ghost"}
                        onClick={() =>
                          ttsMagicModal.onOpen({
                            text: chat.response,
                          })
                        }
                        size={"icon"}
                      >
                        <Sparkles className="text-primary-foreground" />
                        <span className="sr-only">Action</span>
                      </Button>
                    </div>
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
