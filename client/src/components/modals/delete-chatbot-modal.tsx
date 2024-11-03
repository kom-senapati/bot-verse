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
import { deleteObj } from "@/lib/queries";
import { useDeleteChatbotModal } from "@/stores/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function DeleteChatbotModal() {
  const modal = useDeleteChatbotModal();
  const qc = useQueryClient();
  const { queryKeys, id, obj } = modal.extras;
  const mutation = useMutation({
    mutationFn: deleteObj,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys || ["dashboard"] });
    },
    onError: () => {
      toast.error("Failed to delete.");
    },
  });

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
          <AlertDialogAction
            onClick={() =>
              mutation.mutate({
                id: id,
                obj,
              })
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
