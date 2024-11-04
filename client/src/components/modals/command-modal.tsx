"use client";

import * as React from "react";
import { GearIcon } from "@radix-ui/react-icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  AudioWaveform,
  Bot,
  ChartColumn,
  Image,
  Languages,
  PanelTopInactive,
  Plus,
} from "lucide-react";
import {
  useCreateChatbotModal,
  useImagineModal,
  useSettingsModal,
  useTranslateMagicModal,
  useTtsMagicModal,
} from "@/stores/modal-store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function CommandModal() {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const createBotModal = useCreateChatbotModal();
  const settingsModal = useSettingsModal();
  const imagineModal = useImagineModal();
  const ttsModal = useTtsMagicModal();
  const translateModal = useTranslateMagicModal();
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("commandbox.input_ph")} />
        <CommandList>
          <CommandEmpty>{t("commandbox.no_result")}</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => createBotModal.onOpen()}>
              <Plus />
              <span>{t("commandbox.create_chatbot")}</span>
            </CommandItem>
            <CommandItem onSelect={() => ttsModal.onOpen({ text: "" })}>
              <AudioWaveform />
              <span>{t("commandbox.tts")}</span>
            </CommandItem>
            <CommandItem onSelect={() => translateModal.onOpen({ text: "" })}>
              <Languages />
              <span>{t("commandbox.translate")}</span>
            </CommandItem>
            <CommandItem onSelect={() => imagineModal.onOpen()}>
              <Image />
              <span>{t("commandbox.image_generation")}</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate("/anonymous");
              }}
            >
              <Bot />
              <span>{t("commandbox.anonymous_chat")}</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("commandbox.socialize")}>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate("/hub");
              }}
            >
              <PanelTopInactive />
              <span>{t("commandbox.hub")}</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate("/leaderboard");
              }}
            >
              <ChartColumn />
              <span>{t("navbar.leaderboard")}</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading={t("navbar.settings")}>
            <CommandItem onSelect={() => settingsModal.onOpen()}>
              <GearIcon />
              <span>{t("navbar.settings")}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
