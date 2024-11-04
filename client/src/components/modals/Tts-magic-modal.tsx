import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SERVER_URL } from "@/lib/utils";
import { useTtsMagicModal } from "@/stores/modal-store";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";

import { AudioLines, Download, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const markdownToPlainText = (markdown: string) => {
  return markdown
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // Bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // Italics
    .replace(/~~(.*?)~~/g, "$1") // Strikethrough
    .replace(/`{1,2}(.*?)`{1,2}/g, "$1") // Inline code
    .replace(/### (.*?)\n/g, "$1\n") // H3
    .replace(/## (.*?)\n/g, "$1\n") // H2
    .replace(/# (.*?)\n/g, "$1\n") // H1
    .replace(/>\s?(.*?)(?=\n|$)/g, "$1") // Blockquote
    .replace(/^\s*\n/g, "") // Remove empty lines
    .replace(/\n+/g, "\n") // Consolidate newlines
    .trim(); // Trim whitespace
};

export default function TtsMagicModal() {
  const modal = useTtsMagicModal();
  const initialText = modal.extras.text || "";
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Set initial text when the modal opens
  useEffect(() => {
    if (modal.isOpen) {
      setText(initialText); // Set the initial text from modal extras
    }
  }, [modal.isOpen, initialText]); // Depend on modal open state and initial text

  const downloadAudio = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
      };
      const response = await axios.post(
        `${SERVER_URL}/api/tts`,
        { text: markdownToPlainText(text) },
        { responseType: "blob", headers: authHeaders }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "speech.mp3");
      document.body.appendChild(link);
      link.click();
      link.remove();
      modal.onClose();
    } catch (error) {
      toast.error("Error generating audio");
      console.error("Error generating audio", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTextFile = () => {
    // Convert Markdown to plain text
    const plainText = markdownToPlainText(text); // For simplicity, using the existing text directly
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "text.txt");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center justify-between">
              <p>{t("tts_modal.title")}</p>
              <Button
                variant={"outline"}
                size={"icon"}
                className="rounded-full"
                onClick={() => modal.onClose()}
              >
                <X />
              </Button>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("tts_modal.sub_title")}
          </AlertDialogDescription>
          <div className="my-4">
            <Textarea
              disabled={loading}
              value={text}
              onChange={(e) => setText(e.target.value)} // Update state on change
              rows={5}
              className="w-full p-2 border rounded"
              placeholder={t("tts_modal.text")}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            disabled={loading}
            onClick={downloadTextFile}
            className="btn btn-secondary ml-2"
            variant={"secondary"}
          >
            <Download /> {t("tts_modal.text")}
          </Button>
          <Button
            disabled={loading}
            onClick={downloadAudio}
            className="btn btn-primary"
          >
            <AudioLines />
            {loading ? t("tts_modal.generating") : t("tts_modal.generate")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
