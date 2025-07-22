import { exec } from "child_process";
import { promisify } from "util";
import { FabricOptions, FabricResponse } from "../types";
import { showToast, Toast } from "@raycast/api";
import { homedir } from "os";
import { join } from "path";
import { getFabricCommand, getDefaultModel, getTemperature } from "./config";

const execAsync = promisify(exec);

export async function checkFabricInstallation(): Promise<boolean> {
  try {
    const fabricCommand = getFabricCommand();
    // Try to execute fabric with --help to check if it's installed
    // This works better than 'which' as it respects full paths
    await execAsync(`${fabricCommand} --help`);
    return true;
  } catch {
    await showToast({
      style: Toast.Style.Failure,
      title: "Fabric not found",
      message: "Please install Fabric CLI or set the correct path in preferences",
    });
    return false;
  }
}

export async function executeFabricPattern(
  pattern: string,
  input: string,
  options: FabricOptions = {},
): Promise<FabricResponse> {
  try {
    const isInstalled = await checkFabricInstallation();
    if (!isInstalled) {
      return { success: false, error: "Fabric CLI not installed" };
    }

    const fabricCommand = getFabricCommand();
    const model = options.model || getDefaultModel();
    const temperature = options.temperature ?? getTemperature();

    let command = `echo "${input.replace(/"/g, '\\"')}" | ${fabricCommand} --pattern ${pattern}`;

    if (model) {
      command += ` --model ${model}`;
    }

    if (temperature !== undefined) {
      command += ` --temperature ${temperature}`;
    }

    if (options.stream === false) {
      command += " --no-stream";
    }

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      return { success: false, error: stderr };
    }

    return { success: true, output: stdout.trim() };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function listAvailablePatterns(): Promise<string[]> {
  try {
    const fabricCommand = getFabricCommand();
    const { stdout } = await execAsync(`${fabricCommand} --listpatterns`);
    return stdout
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.trim());
  } catch {
    return [];
  }
}

export async function getPatternDescription(pattern: string): Promise<string> {
  try {
    const patternPath = join(
      homedir(),
      ".config",
      "fabric",
      "patterns",
      pattern,
      "system.md",
    );
    const { stdout } = await execAsync(
      `head -n 20 "${patternPath}" 2>/dev/null || echo "No description available"`,
    );

    const lines = stdout.split("\n");
    const descriptionLine = lines.find(
      (line) =>
        line.toLowerCase().includes("purpose") ||
        line.toLowerCase().includes("description"),
    );

    if (descriptionLine) {
      return descriptionLine
        .replace(/^#*\s*(purpose|description):?\s*/i, "")
        .trim();
    }

    return lines.slice(0, 3).join(" ").substring(0, 100) + "...";
  } catch {
    return "No description available";
  }
}

export function categorizePattern(patternName: string): string {
  const name = patternName.toLowerCase();

  if (name.includes("analyze") || name.includes("analysis")) {
    return "Analysis";
  } else if (name.includes("create") || name.includes("generate")) {
    return "Creation";
  } else if (name.includes("extract")) {
    return "Extraction";
  } else if (name.includes("write") || name.includes("improve")) {
    return "Writing";
  } else if (name.includes("security") || name.includes("threat")) {
    return "Security";
  } else {
    return "Specialized";
  }
}
