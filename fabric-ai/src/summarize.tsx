import { Clipboard, showHUD, showToast, Toast } from "@raycast/api";
import { executeFabricPattern } from "./utils/fabric";
import { addToRecentPatterns } from "./utils/patterns";

export default async function Summarize() {
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
      title: "Summarizing text...",
    });

    await addToRecentPatterns("summarize");

    const result = await executeFabricPattern("summarize", clipboardText);

    if (result.success && result.output) {
      await Clipboard.copy(result.output);
      await showHUD("✅ Summary copied to clipboard");
    } else {
      await showToast({
        style: Toast.Style.Failure,
        title: "Summarization failed",
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
