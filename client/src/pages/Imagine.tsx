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
import { authHeaders, fetchImagesData } from "@/lib/queries";
import { messageSchema } from "@/lib/schemas";
import { imageSrc, SERVER_URL } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Download, Loader2, SendIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { z } from "zod";

export default function ImaginePage() {
  const { data } = useQuery({
    queryKey: ["images"],
    queryFn: fetchImagesData,
  });
  const [loading, setLoading] = useState(false); // Loading state for request
  const rq = useQueryClient();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    try {
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

      <div className="flex-1 overflow-y-auto p-6 space-y-6 h-full no-scrollbar">
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
                <div className="flex justify-start items-center space-x-2 mb-2">
                  <div className="max-w-md bg-white dark:bg-dark dark:text-dark/90 text-gray-900 rounded-xl p-4 drop-shadow-md shadow border border-gray-100 dark:border-darker flex flex-col">
                    <img
                      className="rounded-md"
                      src={imageSrc(image.prompt)}
                      alt={image.prompt}
                    />
                    <p className="text-center mt-2">{image.prompt}</p>
                    <div className="flex justify-between mt-2">
                      <a
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 drop-shadow transition duration-200 flex items-center justify-center download-btn"
                        title="Download"
                        target="_blank"
                        href={imageSrc(image.prompt)}
                        download
                      >
                        <Download />
                      </a>
                    </div>
                  </div>
                </div>
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
