import {
  AlertDialog,
  AlertDialogCancel,
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

export default function TtsMagicModal() {
  const modal = useTtsMagicModal();
  const { text: initialText } = modal.extras;

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
      const response = await axios.post(
        `${SERVER_URL}/api/tts`,
        { text },
        { responseType: "blob" }
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

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Convert Text to speech and download
          </AlertDialogTitle>
          <AlertDialogDescription>
            text is converted to audio file in mp3 format that will be
            downloaded automatically.
          </AlertDialogDescription>
          <div className="my-4">
            <Textarea
              disabled={loading}
              value={text}
              onChange={(e) => setText(e.target.value)} // Update state on change
              rows={5}
              className="w-full p-2 border rounded"
              placeholder="Enter text here..."
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button
            disabled={loading}
            onClick={downloadAudio}
            className="btn btn-primary"
          >
            {loading ? "Generating..." : "Generate Audio"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
