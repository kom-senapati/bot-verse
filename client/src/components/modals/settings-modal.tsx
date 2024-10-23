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
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";

export default function SettingsModal() {
  const { fontSize, setFontSize } = useSettings();
  const { setTheme, theme } = useTheme();
  const modal = useSettingsModal();

  return (
    <AlertDialog open={modal.isOpen} onOpenChange={() => modal.onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold mb-4">
            Site Settings
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="fontSize" className="text-right">
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
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="themeToggle" className="text-right">
            Dark Mode
          </Label>
          <Switch
            id="themeToggle"
            checked={theme === "dark"}
            onCheckedChange={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
            className="col-span-3"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Ok</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
