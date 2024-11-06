import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usettHMagic } from "@/stores/modal-store";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import { Download, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { SERVER_URL } from "@/lib/utils";

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

export default function TtHMagicModal() {
  const modal = usettHMagic();
  const initialText = markdownToPlainText(modal.extras.text || "");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(12);

  // Set initial text when the modal opens
  useEffect(() => {
    if (modal.isOpen) {
      setText(initialText); // Set the initial text from modal extras
    }
  }, [modal.isOpen, initialText]); // Depend on modal open state and initial text

  // Function to download as PDF
  const downloadAsPDF = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
      };

      const response = await axios.post(
        `${SERVER_URL}/api/tth`,
        { text, font_size: 12 },
        { responseType: "blob", headers: authHeaders } // Important to handle binary data
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "handwritten_notes.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PDF created successfully!");
    } catch (error) {
      console.log("Error creating PDF:", error);
      toast.error("Failed to create PDF.");
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
              <p>Text-to-Handwriting Magic</p>
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
            Convert Text to Hand written Notes
          </AlertDialogDescription>
          <div className="my-4">
            <Textarea
              disabled={loading}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here"
              rows={5}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <Label>Font Size: </Label>
            <Input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              min="16"
              max="72"
              step="1"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            disabled={loading}
            onClick={downloadAsPDF}
            className="w-full"
            variant={"outline"}
          >
            <Download /> {loading ? "Baking" : "Bake"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
