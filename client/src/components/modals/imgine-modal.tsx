import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { imageSrc, SERVER_URL } from "@/lib/utils";
import { useImagineModal } from "@/stores/modal-store";
import axios from "axios";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import { Pickaxe, X } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function ImagineModal() {
  const modal = useImagineModal();
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [generated, setGenerated] = useState<boolean>(false);
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);

  const GenerateImage = async () => {
    if (text.length <= 3) {
      toast.error("Come on write something unique.");
      return;
    }
    setGenerated(false);
    setImagePrompt("");
    setImagePrompt(text);
    setGenerated(true);
  };

  const SaveImage = async () => {
    setLoading(true);
    try {
      if (imagePrompt && imagePrompt.length <= 3) {
        toast.error("Come on write something unique.");
        return;
      }
      const token = localStorage.getItem("token");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
      };
      const response = await axios.post(
        `${SERVER_URL}/api/imagine`,
        {
          query: imagePrompt,
        },
        {
          headers: authHeaders,
        }
      );
      if (response.data.success) {
        setImagePrompt("");
        setGenerated(false);
        setText("");
      } else {
        toast.error("Error in saving image");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      toast.error(errorMessage);
      console.log("[GENERATION_ERROR]", error);
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
              <p>Imgine a image and generate it</p>
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
            Let's see how you imagination is. I know you are creative enough.
          </AlertDialogDescription>
          <div className="my-4 space-y-2">
            {generated && imagePrompt && (
              <div className="relative aspect-square">
                <ImageWithLoading key={imagePrompt} imagePrompt={imagePrompt} />
              </div>
            )}
            <div className="relative">
              <Textarea
                disabled={loading}
                value={text}
                onChange={(e) => setText(e.target.value)} // Update state on change
                rows={5}
                className="w-full p-2 border rounded"
                placeholder="Enter your imagination prompt here..."
              />
              <Button
                onClick={GenerateImage} // Function to handle icon generation
                className="absolute bottom-2 right-2 rounded-full"
                variant={"outline"}
                size={"icon"}
                disabled={loading} // Disable button when loading
                aria-label="Generate Icon"
              >
                <Pickaxe />
              </Button>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex items-center justify-between w-full">
            <p className="text-muted-foreground text-sm px-2">
              If you want to save this Image in database then Click 'Capture'
            </p>
            <Button
              disabled={loading}
              onClick={SaveImage}
              className="btn btn-primary"
            >
              Capture
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ImageWithLoading({ imagePrompt }: { imagePrompt: string }) {
  const [loading, setLoading] = useState(true);
  // Handle when image loads
  const handleImageLoad = () => {
    setLoading(false); // Hide loader
  };
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full">
          <Skeleton className="w-full h-full rounded-t-lg" />
        </div>
      )}
      <img
        key={imagePrompt}
        className="rounded-t-lg"
        alt={imagePrompt}
        src={imageSrc(imagePrompt)}
        onLoad={handleImageLoad}
      />
    </div>
  );
}
