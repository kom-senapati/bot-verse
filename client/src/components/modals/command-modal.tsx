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

export function CommandModal() {
  const [open, setOpen] = React.useState(false);

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
      <div className="flex justify-between p-1">
        <p className="text-sm text-muted-foreground font-mono ">
          Open Command Panel
        </p>
        <p className="text-sm text-muted-foreground">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </p>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => createBotModal.onOpen()}>
              <Plus />
              <span>Create Chatbot</span>
            </CommandItem>
            <CommandItem onSelect={() => ttsModal.onOpen({ text: "" })}>
              <AudioWaveform />
              <span>Text-to-Speech Magic</span>
            </CommandItem>
            <CommandItem onSelect={() => translateModal.onOpen({ text: "" })}>
              <Languages />
              <span>Translate Magic</span>
            </CommandItem>
            <CommandItem onSelect={() => imagineModal.onOpen()}>
              <Image />
              <span>Generate Images</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate("/anonymous");
              }}
            >
              <Bot />
              <span>Anonymous Chat</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Socialize">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate("/hub");
              }}
            >
              <PanelTopInactive />
              <span>Marketplace Hub</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate("/leaderboard");
              }}
            >
              <ChartColumn />
              <span>Leaderboard</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => settingsModal.onOpen()}>
              <GearIcon />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
