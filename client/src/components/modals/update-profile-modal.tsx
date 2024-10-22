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
import { useUpdateProfileModal } from "@/stores/modal-store";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfileSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SERVER_URL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { authHeaders } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdateProfileModal() {
  const modal = useUpdateProfileModal();

  const { prevName, prevBio, prevUsername } = modal.extras;

  const [loading, setLoading] = useState(false); // Loading state for request
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

  if (form.getValues().name === "") {
    form.reset({
      name: prevName,
      bio: prevBio,
      username: prevUsername,
    });
  }

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold mb-4">
            Update The Profile
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
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
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Save"}
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
