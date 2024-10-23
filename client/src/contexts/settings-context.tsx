import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
interface SettingsContextProps {
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
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

  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize") as
      | "small"
      | "medium"
      | "large";
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  const updateFontSize = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
  };

  // Other settings can be handled similarly
  return (
    <SettingsContext.Provider value={{ fontSize, setFontSize: updateFontSize }}>
      <ThemeProvider enableSystem attribute="class">
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
