import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authHeaders } from "@/lib/queries";
import { SERVER_URL } from "@/lib/utils";
import { useDeleteChatbotModal } from "@/stores/modal-store";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function DeleteChatbotModal() {
  const modal = useDeleteChatbotModal();
  const rq = useQueryClient();
  async function handleDelete() {
    try {
      const { id } = modal.extras;
      if (!id) return;

      const response = await axios.post(
        `${SERVER_URL}/api/chatbot/${id}/delete`,
        {},
        { headers: authHeaders }
      );
      if (response.data?.success) {
        toast.success(response.data?.message || "Deleted!");
        modal.onClose();
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
      console.log("[DELETION_ERROR]", error);
    }
  }

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            chatbot and remove it's data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
