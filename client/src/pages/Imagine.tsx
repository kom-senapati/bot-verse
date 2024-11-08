import Separator from "@/components/Separator";
import transition from "@/components/transition";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchImagesData } from "@/lib/queries";
import { messageSchema } from "@/lib/schemas";
import { imageSrc, SERVER_URL } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Download, Loader2, SendIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { z } from "zod";

function ImaginePage() {
  const { data } = useQuery({
    queryKey: ["images"],
    queryFn: fetchImagesData,
  });
  const messageEl = useRef(null);
  const [loading, setLoading] = useState(false); // Loading state for request
  const rq = useQueryClient();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      query: "",
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
  }, [data, scrollToBottom]);

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    try {
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
      };
      setLoading(true);
      const response = await axios.post(`${SERVER_URL}/api/imagine`, values, {
        headers: authHeaders,
      });
      if (response.data?.success) {
        form.reset();
        rq.invalidateQueries({ queryKey: ["images"] });
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
            src="https://robohash.org/Imagine"
            alt="Imagine's avatar"
            className="w-10 h-10 border rounded-full dark:border-darker mr-3"
          />
          <h1 className="text-4xl font-extrabold dark:text-dark text-center">
            Imagine Images
          </h1>
        </div>
      </div>
      <Separator className="my-0" />

      <div
        ref={messageEl}
        className="flex-1 overflow-y-auto p-6 space-y-6 h-full no-scrollbar"
      >
        {!data ? (
          <Loading />
        ) : (
          <>
            {data.length == 0 && (
              <p className="text-center text-gray-500">
                No Images generated yet.
              </p>
            )}
            {data.map((image) => (
              <>
                <Card className="w-full max-w-sm overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative aspect-square">
                      <img
                        src={imageSrc(image.prompt)}
                        alt={image.prompt}
                        className="rounded-t-lg"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {image.prompt}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <a
                      title="Download"
                      download
                      target="_blank"
                      href={imageSrc(image.prompt)}
                    >
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              </>
            ))}
          </>
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

export default transition(ImaginePage);
