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
import { useSettings } from "@/contexts/settings-context";
import { messageSchema } from "@/lib/schemas";
import { SERVER_URL } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, Loader2, SendIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import { z } from "zod";

export default function AnonymousPage() {
  const [loading, setLoading] = useState(false); // Loading state for request
  const [messages, setMessages] = useState<Chat[]>([]);
  const { t } = useTranslation();
  const { currentConfig } = useSettings();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    if (currentConfig == null) {
      toast.error("Please Select AI engine in settings");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
        Apikey: currentConfig.apiKey,
        engine: currentConfig.engine,
      };
      setLoading(true);
      const response = await axios.post(
        `${SERVER_URL}/api/anonymous`,
        { ...values, prev: messages },
        {
          headers: authHeaders,
        }
      );
      if (response.data?.success) {
        const newChat: Chat = {
          user_query: values.query,
          response: response.data.response,
          chatbot_id: 0,
          id: 0,
          user_id: 0,
        };
        setMessages((prev) => [...prev, newChat]);
        form.reset();
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
            src="https://robohash.org/Anonymous Bot"
            alt={`Anonymous Bot's avatar`}
            className="w-10 h-10 border rounded-full dark:border-darker mr-3"
          />
          <h1 className="text-4xl font-extrabold dark:text-dark text-center">
            Anonymous Bot
          </h1>
        </div>
      </div>
      <Separator className="my-0" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 h-full no-scrollbar">
        {messages.map((chat) => (
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
                    placeholder={t("message.ph")}
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
