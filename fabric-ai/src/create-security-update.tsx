import { Clipboard, showHUD, showToast, Toast } from "@raycast/api";
import { executeFabricPattern } from "./utils/fabric";
import { addToRecentPatterns } from "./utils/patterns";

export default async function CreateSecurityUpdate() {
  try {
    const clipboardText = await Clipboard.readText();

    if (!clipboardText) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No text in clipboard",
        message: "Copy some text to your clipboard first",
      });
      return;
    }

    await showToast({
      style: Toast.Style.Animated,
      title: "Creating security update...",
    });

    await addToRecentPatterns("create_security_update");

    const result = await executeFabricPattern(
      "create_security_update",
      clipboardText,
    );

    if (result.success && result.output) {
      await Clipboard.copy(result.output);
      await showHUD("✅ Result copied to clipboard");
    } else {
      await showToast({
        style: Toast.Style.Failure,
        title: "Pattern execution failed",
        message: result.error,
      });
    }
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
