import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { useSettingsModal } from "@/stores/modal-store";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSettings } from "@/contexts/settings-context";
import { ToggleButton } from "../theme-toggle";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { useState } from "react";

export default function SettingsModal() {
  const { fontSize, setFontSize, apiKey, updateApiKey } = useSettings();
  const [apistate, setApistate] = useState(apiKey);
  const modal = useSettingsModal();

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold mb-4">
            Site Settings
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex items-center justify-between">
          <Label htmlFor="fontSize" className="text-center w-full">
            Font Size
          </Label>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <ToggleButton />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-center w-[50%]">API KEY</Label>
          <div className="relative w-full">
            <Input
              value={apistate || ""}
              placeholder="Your API key"
              onChange={(e) => {
                setApistate(e.target.value);
                updateApiKey(apistate || "");
              }}
            />
            <div className="absolute inset-y-0 end-0 flex items-center">
              <Button
                variant="ghost"
                onClick={() => updateApiKey(apistate || "")}
                className="rounded-full"
                size="icon"
              >
                <Save className="m-4" />
              </Button>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Ok</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
