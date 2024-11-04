import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useShareModal } from "@/stores/modal-store";
import { useTranslation } from "react-i18next";
import {
  EmailIcon,
  EmailShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  XIcon,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
} from "react-share";

export default function ShareModal() {
  const modal = useShareModal();
  const { title, shareUrl } = modal.extras;
  const { t } = useTranslation();

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-x-2">
              <FacebookShareButton url={shareUrl} title={title}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={title}>
                <XIcon size={32} round />
              </TwitterShareButton>

              <WhatsappShareButton url={shareUrl} title={title} separator="->">
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>

              <LinkedinShareButton url={shareUrl} title={title}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <RedditShareButton url={shareUrl} title={title}>
                <RedditIcon size={32} round />
              </RedditShareButton>
              <TelegramShareButton url={shareUrl} title={title}>
                <TelegramIcon size={32} round />
              </TelegramShareButton>
              <EmailShareButton url={shareUrl} title={title}>
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("continue")}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
