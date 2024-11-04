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
import { useUpdateProfileModal } from "@/stores/modal-store";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfileSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SERVER_URL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function UpdateProfileModal() {
  const modal = useUpdateProfileModal();
  const { prevName, prevBio, prevUsername } = modal.extras;

  const [loading, setLoading] = useState(false); // Loading state for request
  const { t } = useTranslation();
  const rq = useQueryClient();
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      bio: "",
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    try {
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
      };
      setLoading(true);
      const response = await axios.post(
        `${SERVER_URL}/api/profile/edit`,
        values,
        { headers: authHeaders }
      );
      if (response.data?.success) {
        toast.success("Updated!");
        modal.onClose();
        form.reset();
        rq.invalidateQueries({ queryKey: ["user", values.username] });
      } else {
        throw new Error(response.data?.message || "failed. Please try again.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      toast.error(errorMessage);
      console.log("[UPDATING_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (modal.isOpen) {
      form.reset({
        name: prevName,
        bio: prevBio,
        username: prevUsername,
      });
    }
  }, [modal.isOpen, prevName, prevBio, prevUsername]); // Depend on modal open state and initial text

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold mb-4">
            {t("profile_update.title")}
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.username")}</FormLabel>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile_update.bio")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
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
