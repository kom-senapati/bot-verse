import CreateChatbotModal from "@/components/modals/create-chatbot-modal";
import DeleteChatbotModal from "@/components/modals/delete-chatbot-modal";
import ImagineModal from "@/components/modals/imgine-modal";
import SettingsModal from "@/components/modals/settings-modal";
import ShareModal from "@/components/modals/share-modal";
import TranslateMagicModal from "@/components/modals/translate-magic-modal";
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
      <TtsMagicModal />
      <TranslateMagicModal />
      <ImagineModal />
      <DeleteChatbotModal />
    </>
  );
}
