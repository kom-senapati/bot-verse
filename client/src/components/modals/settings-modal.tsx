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

const chatbotEngines = ["openai", "groq", "anthropic", "gemini"];

export default function SettingsModal() {
  const {
    fontSize,
    setFontSize,
    configurations,
    setConfigurations,
    currentConfig,
    setCurrentConfig,
  } = useSettings();

  const [apiKey, setApiKey] = useState(
    currentConfig ? currentConfig.apiKey : ""
  );
  const [selectedEngine, setSelectedEngine] = useState<string | null>(
    currentConfig ? currentConfig.engine : chatbotEngines[1] // Default to "groq"
  );
  const modal = useSettingsModal();

  const handleSaveConfig = () => {
    if (!selectedEngine) {
      alert("Please select a chatbot engine.");
      return;
    }

    const newConfig: EngineConfig = { engine: selectedEngine, apiKey };
    const existingConfigIndex = configurations.findIndex(
      (config) => config.engine === selectedEngine
    );

    if (existingConfigIndex >= 0) {
      const updatedConfigs = [...configurations];
      updatedConfigs[existingConfigIndex] = newConfig;
      setConfigurations(updatedConfigs);
    } else {
      setConfigurations([...configurations, newConfig]);
    }

    // Save to local storage
    localStorage.setItem("chatbotConfigurations", JSON.stringify(configurations));
    setCurrentConfig(newConfig);
  };

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

        <div className="flex flex-col space-y-4">
          <Label className="text-center">API Keys and Engines</Label>
          <div className="flex items-center justify-between">
            <Select
              value={selectedEngine || ""}
              onValueChange={(engine) => {
                setSelectedEngine(engine);
                const config = configurations.find(
                  (config) => config.engine === engine
                );
                if (config) {
                  setApiKey(config.apiKey); // Update API key input when engine changes
                } else {
                  //setApiKey(""); // Clear API key if no config found
                }
              }}
            >
              <SelectTrigger className="w-[40%]">
                <SelectValue placeholder="Select engine" />
              </SelectTrigger>
              <SelectContent>
                {chatbotEngines.map((engine) => (
                  <SelectItem key={engine} value={engine}>
                    {engine.charAt(0).toUpperCase() + engine.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative w-[50%] mr-10">
              <Input
                value={apiKey}
                placeholder="Your API key"
                className="pr-2"
                onChange={(e) => setApiKey(e.target.value)}
              />
              <div className="absolute inset-y-0 -end-12 flex items-center">
                <Button
                  variant="outline"
                  onClick={handleSaveConfig}
                  className="ml-3 rounded-full"
                  size="icon"
                >
                  <Save className="m-4" />
                </Button>
              </div>
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
