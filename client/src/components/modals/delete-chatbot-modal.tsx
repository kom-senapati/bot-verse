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
import { useTranslation } from "react-i18next";

export default function DeleteChatbotModal() {
  const modal = useDeleteChatbotModal();
  const qc = useQueryClient();
  const { t } = useTranslation();
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
          <AlertDialogTitle>{t("delete_modal.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("delete_modal.sub_title")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              mutation.mutate({
                id: id,
                obj,
              })
            }
          >
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
