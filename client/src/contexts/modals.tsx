import CreateChatbotModal from "@/components/modals/create-chatbot-modal";
import DeleteChatbotModal from "@/components/modals/delete-chatbot-modal";
import UpdateChatbotModal from "@/components/modals/update-chatbot-modal";
import UpdateProfileModal from "@/components/modals/update-profile-modal";

export default function Modals() {
  return (
    <>
      <CreateChatbotModal />
      <UpdateChatbotModal />
      <UpdateProfileModal />
      <DeleteChatbotModal />
    </>
  );
}
