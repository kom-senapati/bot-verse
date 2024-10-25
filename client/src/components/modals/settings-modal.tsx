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

export default function SettingsModal() {
  const { fontSize, setFontSize } = useSettings();
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

        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Ok</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
