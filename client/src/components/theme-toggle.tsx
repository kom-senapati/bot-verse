import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const ToggleButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, themes } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <Label className="text-center w-full">Current Theme</Label>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Select font size" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((t) => (
            <SelectItem value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
