import Separator from "@/components/Separator";
import transition from "@/components/transition";
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
import { ArrowLeft, Loader2, SendIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useTranslateMagicModal,
  usettHMagic,
  useTtsMagicModal,
} from "@/stores/modal-store";

function AnonymousPage() {
  const [loading, setLoading] = useState(false); // Loading state for request
  const [messages, setMessages] = useState<Chat[]>([]);
  const { t } = useTranslation();
  const { currentConfig } = useSettings();
  const ttsMagicModal = useTtsMagicModal();
  const ttHMagicModal = usettHMagic();
  const translateMagicModal = useTranslateMagicModal();
  const navigate = useNavigate();
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
          <Button
            onClick={() => navigate(-1)}
            variant={"outline"}
            size={"icon"}
            className="rounded-full"
          >
            <ArrowLeft className="w-10 h-10" />
          </Button>
          <img
            src="https://robohash.org/Anonymous"
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
            <div className="flex justify-end m-2">
              <div className="bg-secondary rounded-full p-4">
                <p className="text-sm text-secondary-foreground">
                  {chat.user_query}
                </p>
              </div>
            </div>
            <div className="flex items-start justify-start py-3">
              <img
                src="https://robohash.org/Anonymous"
                alt={`Anonymous's avatar`}
                className="w-10 h-10 border rounded-full mx-4"
              />

              <div className="mr-4">
                <Markdown className="text-sm">{chat.response}</Markdown>
                <div className="flex justify-start py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        className="rounded-full hover:bg-primary/10 bg-primary/5"
                        variant={"ghost"}
                        size={"icon"}
                      >
                        <Sparkles className="text-primary" />
                        <span className="sr-only">
                          {t("chatbot_page.action")}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          translateMagicModal.onOpen({
                            text: chat.response,
                          })
                        }
                      >
                        {t("chatbot_page.translate")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          ttsMagicModal.onOpen({
                            text: chat.response,
                          })
                        }
                      >
                        {t("chatbot_page.listen")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          ttHMagicModal.onOpen({
                            text: chat.response,
                          })
                        }
                      >
                        Handwriting
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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

export default transition(AnonymousPage);
