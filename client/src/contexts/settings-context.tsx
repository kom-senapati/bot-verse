import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
interface SettingsContextProps {
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  configurations: EngineConfig[];
  setConfigurations: (configs: EngineConfig[]) => void;
  currentConfig: EngineConfig | null;
  setCurrentConfig: (config: EngineConfig | null) => void;
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

  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize") as
      | "small"
      | "medium"
      | "large";

    const savedConfigs = localStorage.getItem("configurations");
    if (savedConfigs) {
      try {
        const parsedConfigs = JSON.parse(savedConfigs);
        // Optionally, you can check if parsedConfigs is an array or object
        if (Array.isArray(parsedConfigs) || typeof parsedConfigs === "object") {
          setConfigurations(parsedConfigs);
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
  }, []);

  const updateFontSize = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
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
      }}
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
