import { DefaultModal, defaultModalValues } from "@/types/default-modal-store";
import { create } from "zustand";

export const useCreateChatbotModal = create<DefaultModal>(defaultModalValues);
export const useDeleteChatbotModal = create<DefaultModal>(defaultModalValues);
export const useUpdateChatbotModal = create<DefaultModal>(defaultModalValues);
export const useUpdateProfileModal = create<DefaultModal>(defaultModalValues);
export const useSettingsModal = create<DefaultModal>(defaultModalValues);
export const useShareModal = create<DefaultModal>(defaultModalValues);
export const useTtsMagicModal = create<DefaultModal>(defaultModalValues);
export const useTranslateMagicModal = create<DefaultModal>(defaultModalValues);
export const useImagineModal = create<DefaultModal>(defaultModalValues);
