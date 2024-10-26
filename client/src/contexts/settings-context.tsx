import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
interface SettingsContextProps {
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  updateApiKey: (key: string) => void;
  apiKey: null | string;
  // Add more settings as needed
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );

  const [apiKey, setApiKey] = useState<null | string>(null);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize") as
      | "small"
      | "medium"
      | "large";

    const savedApikey = localStorage.getItem("apikey");
    if (savedApikey) setApiKey(savedApikey);
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  const updateFontSize = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
  };

  const updateApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("apikey", key);
  };

  const themes = [
    "Light",
    "Dark",
    "One Dark",
    "Material Ocean",
    "Purple Dark",
    "Discord",
  ];

  // Other settings can be handled similarly
  return (
    <SettingsContext.Provider
      value={{ fontSize, setFontSize: updateFontSize, apiKey, updateApiKey }}
    >
      <ThemeProvider enableSystem={false} themes={themes}>
        <div className={`font-size-${fontSize}`}>{children}</div>
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};

// Hook to use settings
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
};
