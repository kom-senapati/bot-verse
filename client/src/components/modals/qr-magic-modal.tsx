import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQRCodeStore } from "@/stores/modal-store"; // Assuming you have modal store for opening the modal
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import QRCode from "qrcode"; // QRCode from qrcode-react package
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export default function QRCodeGeneratorModal() {
  const modal = useQRCodeStore(); // Modal state control
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(""); // Text or URL to generate QR code
  const [generatedQRCode, setGeneratedQRCode] = useState(""); // Base64 QR code data

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQrData(e.target.value);
  };

  // Handle QR Code generation
  const handleGenerateQRCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!qrData)
      return toast.error("Please enter text or URL to generate QR code!");

    setLoading(true);
    try {
      const qrCodeData = await QRCode.toDataURL(qrData); // Generate QR Code data as a base64 URL
      setGeneratedQRCode(qrCodeData);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR Code.");
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
              <p>QR Code Generator Tool</p>
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
        </AlertDialogHeader>
        <AlertDialogDescription>
          Generate a QR Code for any URL or text input.
        </AlertDialogDescription>
        <div className="grid gap-4 w-full">
          <form
            onSubmit={handleGenerateQRCode}
            className="w-full flex items-center flex-col gap-4"
          >
            {generatedQRCode && (
              <div className="mt-4 flex justify-center items-center flex-col">
                <img
                  src={generatedQRCode}
                  alt="Generated QR Code"
                  className="max-w-full h-auto"
                />
                <div className="mt-2 text-sm text-center">
                  <a
                    href={generatedQRCode}
                    download="qrcode.png"
                    className="text-blue-600"
                  >
                    Download QR Code
                  </a>
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[75%]" />
              </div>
            )}
            <Input
              type="text"
              value={qrData}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Enter text or URL"
              className="w-full"
            />
            <Button
              disabled={loading}
              className="w-full"
              variant={"outline"}
              type="submit"
            >
              {loading ? "Generating..." : "Generate QR Code"}
            </Button>
          </form>
        </div>
        <AlertDialogFooter />
      </AlertDialogContent>
    </AlertDialog>
  );
}
