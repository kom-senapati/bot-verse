import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SERVER_URL } from "@/lib/utils";
import { useTranslateMagicModal } from "@/stores/modal-store";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";

import { Download, Languages, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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

const languageOptions = [
  { code: "or", label: "Oriya" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "ru", label: "Russian" },
  // Add more languages as needed
];

export default function TranslateMagicModal() {
  const modal = useTranslateMagicModal();
  const initialText = modal.extras.text || "";
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currenLang, setCurrenLang] = useState("en");

  // Set initial text when the modal opens
  useEffect(() => {
    if (modal.isOpen) {
      setText(initialText); // Set the initial text from modal extras
    }
  }, [modal.isOpen, initialText]); // Depend on modal open state and initial text

  const downloadTextFile = () => {
    // Convert Markdown to plain text
    const plainText = markdownToPlainText(text); // For simplicity, using the existing text directly
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `translated_${language}.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const translateText = async () => {
    setLoading(true);
    try {
      if (language === "") {
        toast.error("Select A language");
        return;
      }
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
      };
      const response = await axios.post(
        `${SERVER_URL}/api/translate`,
        {
          text: markdownToPlainText(text),
          to_language: language,
          from_language: currenLang,
        },
        { headers: authHeaders }
      );
      setText(response.data.translated);
      setCurrenLang(language);
    } catch (error) {
      toast.error("Error in translating");
      console.error("Error in translating text", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center justify-between">
              <p>{t("translate_modal.title")}</p>
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
            {t("translate_modal.sub_title")}
          </AlertDialogDescription>
          <div className="my-4 space-y-2">
            <Select onValueChange={(c) => setLanguage(c)}>
              <SelectTrigger>
                <SelectValue placeholder={t("navbar.language")} />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.label} value={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            onClick={translateText}
            className="btn btn-primary"
          >
            <Languages />
            {loading ? "Translating..." : "Translate"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
