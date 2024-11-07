import CreateChatbotModal from "@/components/modals/create-chatbot-modal";
import DeleteChatbotModal from "@/components/modals/delete-chatbot-modal";
import ImageCaptioningModal from "@/components/modals/image-captioning-magic-modal";
import ImagineModal from "@/components/modals/imgine-modal";
import OcrMagicModal from "@/components/modals/ocr-magic-modal";
import SettingsModal from "@/components/modals/settings-modal";
import ShareModal from "@/components/modals/share-modal";
import TranslateMagicModal from "@/components/modals/translate-magic-modal";
import TtHMagicModal from "@/components/modals/ttH-magic-modal";
import TtsMagicModal from "@/components/modals/Tts-magic-modal";
import UpdateChatbotModal from "@/components/modals/update-chatbot-modal";
import UpdateProfileModal from "@/components/modals/update-profile-modal";

export default function Modals() {
  return (
    <>
      <CreateChatbotModal />
      <UpdateChatbotModal />
      <UpdateProfileModal />
      <SettingsModal />
      <ShareModal />
      <OcrMagicModal />
      <TtHMagicModal />
      <TtsMagicModal />
      <ImageCaptioningModal />
      <TranslateMagicModal />
      <ImagineModal />
      <DeleteChatbotModal />
    </>
  );
}
