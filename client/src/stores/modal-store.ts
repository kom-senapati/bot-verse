import { DefaultModal, defaultModalValues } from "@/types/default-modal-store";
import { create } from "zustand";

export const useCreateChatbotModal = create<DefaultModal>(defaultModalValues);
export const useDeleteChatbotModal = create<DefaultModal>(defaultModalValues);
export const useUpdateChatbotModal = create<DefaultModal>(defaultModalValues);
export const useUpdateProfileModal = create<DefaultModal>(defaultModalValues);
export const useSettingsModal = create<DefaultModal>(defaultModalValues);
