import { useEffect, useState } from "react";

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
import { useUpdateChatbotModal } from "@/stores/modal-store";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createChatbotSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatbotCategories, SERVER_URL } from "@/lib/utils";
import { Loader2, StepBack } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTranslation } from "react-i18next";

interface Extras {
  id: number;
  prevPrompt: string;
  prevName: string;
  prevCategory: string;
  versions: ChatbotVersion[];
}

export default function UpdateChatbotModal() {
  const modal = useUpdateChatbotModal();
  const {
    id,
    prevName,
    prevPrompt,
    prevCategory,
    versions: initialVersions,
  }: Extras = modal.extras;
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null); // State for selected version
  const [versions, setVersions] = useState<ChatbotVersion[]>([]);
  const [loading, setLoading] = useState(false); // Loading state for request
  const { t } = useTranslation();
  const rq = useQueryClient();
  const form = useForm<z.infer<typeof createChatbotSchema>>({
    resolver: zodResolver(createChatbotSchema),
    defaultValues: {
      name: "",
      prompt: "",
      category: "",
    },
  });

  useEffect(() => {
    if (modal.isOpen) {
      form.reset({
        name: prevName,
        prompt: prevPrompt,
        category: prevCategory,
      });
      setVersions(initialVersions);
    }
  }, [modal.isOpen, prevName, prevPrompt, prevCategory, initialVersions]); // Depend on modal open state and initial text

  async function onSubmit(values: z.infer<typeof createChatbotSchema>) {
    try {
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
      };
      setLoading(true);
      const response = await axios.post(
        `${SERVER_URL}/api/chatbot/${id}/update`,
        values,
        { headers: authHeaders }
      );
      if (response.data?.success) {
        toast.success("Updated!");
        await rq.invalidateQueries({ queryKey: ["chatbot_view", id] });

        modal.onClose();
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
      console.log("[CREATION_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }
  async function onRevert() {
    if (selectedVersion) {
      try {
        const token = localStorage.getItem("token");
        const authHeaders = {
          Authorization: `Bearer ${token || ""}`,
        };
        setLoading(true);
        const response = await axios.post(
          `${SERVER_URL}/api/chatbot/${id}/revert/${selectedVersion}`,
          {},
          { headers: authHeaders }
        );

        if (response.data?.success) {
          toast.success("Reverted to selected version!");
          await rq.invalidateQueries({ queryKey: ["chatbot_view", id] });
          modal.onClose();
          form.reset();
        } else {
          throw new Error(
            response.data?.message || "Failed to revert. Please try again."
          );
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.";
        toast.error(errorMessage);
        console.log("[REVERT_ERROR]", error);
      } finally {
        setLoading(false);
      }
    }
  }

  if (form.getValues().name === "") {
    form.reset({
      name: prevName,
      prompt: prevPrompt,
      category: prevCategory,
    });
  }

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold mb-4">
            {t("chatbot_update.title")}
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
                  <FormLabel>{t("auth.name")}</FormLabel>
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
                  <FormLabel>{t("create_chatbot.prompt")}</FormLabel>
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
                  <FormLabel>{t("create_chatbot.category")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
            {versions.length <= 1 ? null : (
              <>
                <div>
                  <FormLabel>{t("chatbot_update.revert_title")}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const index = versions.findIndex(
                        (version) => version.id === Number(value)
                      );
                      setSelectedVersion(Number(value));
                      if (index !== -1) {
                        form.setValue("prompt", versions[index].prompt);
                        form.setFocus("prompt");
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("chatbot_update.select_version")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {versions.map((version) => (
                        <SelectItem value={`${version.id}`} key={version.id}>
                          {t("chatbot_update.version")} {version.version_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  className="w-full flex items-center justify-center"
                  onClick={onRevert}
                  disabled={loading || !selectedVersion}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <StepBack className="mr-2" />
                  )}
                  {t("chatbot_update.revert")}
                </Button>
              </>
            )}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : t("save")}
            </Button>
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full" disabled={loading}>
            {t("cancel")}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
