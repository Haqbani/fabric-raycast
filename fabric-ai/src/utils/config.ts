import { getPreferenceValues } from "@raycast/api";
import { existsSync } from "fs";

export interface Preferences {
  defaultModel?: string;
  temperature?: string;
  fabricPath?: string;
  defaultOutputMode?: "clipboard" | "file" | "replace";
  apiProvider?: string;
}

export function getPreferences(): Preferences {
  return getPreferenceValues<Preferences>();
}

export function getFabricCommand(): string {
  const prefs = getPreferences();
  // If a custom path is set, use it
  if (prefs.fabricPath) {
    return prefs.fabricPath;
  }
  
  // Check common installation paths
  const commonPaths = [
    '/Users/mohammedalhaqbani/go/bin/fabric',
    '/usr/local/bin/fabric',
    '/opt/homebrew/bin/fabric',
    'fabric'
  ];
  
  for (const path of commonPaths) {
    try {
      if (existsSync(path)) {
        return path;
      }
    } catch {
      // Continue to next path
    }
  }
  
  // Default to 'fabric' if none found
  return "fabric";
}

export function getDefaultModel(): string | undefined {
  const prefs = getPreferences();
  return prefs.defaultModel;
}

export function getTemperature(): number | undefined {
  const prefs = getPreferences();
  return prefs.temperature ? parseFloat(prefs.temperature) : undefined;
}
