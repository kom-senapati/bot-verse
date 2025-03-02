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

  // Apply theme to document element whenever theme changes
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      // Also store in localStorage for our initializer to use
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  if (!mounted) return null;

  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <Label className="text-center w-full">Current Theme</Label>
      <Select value={theme} onValueChange={handleThemeChange}>
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
