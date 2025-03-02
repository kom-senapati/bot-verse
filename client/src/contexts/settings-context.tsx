import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

interface EngineConfig {
  engine: string;
  apiKey: string;
}

interface SettingsContextProps {
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  configurations: EngineConfig[];
  setConfigurations: (configs: EngineConfig[]) => void;
  currentConfig: EngineConfig | null;
  setCurrentConfig: (config: EngineConfig | null) => void;
  updateReadAloud: (s: boolean) => void;
  readAloudEnabled: boolean;
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

  const [configurations, setConfigurations] = useState<EngineConfig[]>([]);
  const [currentConfig, setCurrentConfig] = useState<EngineConfig | null>(null);
  const [readAloudEnabled, setReadAloudEnabled] = useState<boolean>(false);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize") as
      | "small"
      | "medium"
      | "large";

    const savedRealAloudStatus = localStorage.getItem("enableReadAloud");

    const savedConfigs = localStorage.getItem("configurations");
    if (savedConfigs) {
      try {
        const parsedConfigs: EngineConfig[] = JSON.parse(savedConfigs);
        if (Array.isArray(parsedConfigs)) {
          setConfigurations(parsedConfigs);
          setCurrentConfig(parsedConfigs.length > 0 ? parsedConfigs[0] : null);
        } else {
          console.error(
            "Parsed configuration is not valid. Expected an array or object."
          );
        }
      } catch (error) {
        console.error("Failed to parse savedConfigs:", error);
      }
    }

    if (savedFontSize) setFontSize(savedFontSize);
    if (savedRealAloudStatus) {
      if (savedRealAloudStatus == "1") {
        setReadAloudEnabled(true);
      } else {
        setReadAloudEnabled(false);
      }
    }
  }, []);

  const updateFontSize = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
  };

  const updateReadAloud = (s: boolean) => {
    setReadAloudEnabled(s);
    if (s == true) {
      localStorage.setItem("enableReadAloud", "1");
    } else {
      localStorage.setItem("enableReadAloud", "0");
    }
  };

  const saveConfigurations = (configs: EngineConfig[]) => {
    setConfigurations(configs);
    localStorage.setItem("configurations", JSON.stringify(configs));
  };

  const themes = [
    "Light",
    "Dark",
    "One Dark",
    "Material Ocean",
    "Purple Dark",
    "Discord",
  ];

  // Apply theme to document element if not already set
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (!currentTheme) {
      document.documentElement.setAttribute('data-theme', 'Dark');
    }
  }, []);

  // Other settings can be handled similarly
  return (
    <SettingsContext.Provider
      value={{
        fontSize,
        setFontSize: updateFontSize,
        configurations,
        setConfigurations: saveConfigurations,
        currentConfig,
        setCurrentConfig,
        readAloudEnabled,
        updateReadAloud,
      }}
    >
      <ThemeProvider defaultTheme="Dark" enableSystem={false} themes={themes}>
        <div className={`font-size-${fontSize}`}>{children}</div>
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};

// Hook to use settings
// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
};
