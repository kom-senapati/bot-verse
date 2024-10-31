"use client";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateChatbotModal } from "@/stores/modal-store";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createChatbotSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatbotCategories, SERVER_URL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useCopilotAction } from "@copilotkit/react-core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function CreateChatbotModal() {
  const modal = useCreateChatbotModal();
  const [loading, setLoading] = useState(false); // Loading state for request
  const rq = useQueryClient();
  const form = useForm<z.infer<typeof createChatbotSchema>>({
    resolver: zodResolver(createChatbotSchema),
    defaultValues: {
      name: "",
      prompt: "",
      category: "",
    },
  });

  useCopilotAction({
    name: "createChatbot",
    description: "Add a new chatbot to the list",
    parameters: [
      {
        name: "ChatbotName",
        type: "string",
        description: "The name of the chatbot",
        required: true,
      },
      {
        name: "ChatbotPrompt",
        type: "string",
        description: "The prompt of the chatbot",
        required: true,
      },
    ],
    handler: async ({ ChatbotName, ChatbotPrompt }) => {
      await onSubmit({
        name: ChatbotName,
        prompt: ChatbotPrompt,
        category: "general",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof createChatbotSchema>) {
    try {
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
      };
      setLoading(true);
      const response = await axios.post(
        `${SERVER_URL}/api/create_chatbot`,
        values,
        { headers: authHeaders }
      );
      if (response.data?.success) {
        toast.success("Created!");
        modal.onClose();
        form.reset();
        rq.invalidateQueries({ queryKey: ["dashboard"] });
      } else {
        throw new Error(response.data?.message || "failed. Please try again.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      toast.error(errorMessage);
      console.log("[CREATION_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold mb-4">
            Create a new Chatbot
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              disabled={loading}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={loading}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={"General"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chatbotCategories.map((category) => (
                        <SelectItem value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full" disabled={loading}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
