import {
  ActionPanel,
  Action,
  Form,
  showToast,
  Toast,
  Clipboard,
  showHUD,
  getSelectedText,
} from "@raycast/api";
import { useState, useEffect } from "react";
import {
  executeFabricPattern,
  listAvailablePatterns,
  checkFabricInstallation,
} from "./utils/fabric";
import { addToRecentPatterns } from "./utils/patterns";

interface FormValues {
  pattern: string;
  input: string;
  inputSource: string;
  outputDestination: string;
}

export default function RunPattern() {
  const [patterns, setPatterns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clipboardText, setClipboardText] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const isInstalled = await checkFabricInstallation();
      if (!isInstalled) {
        setIsLoading(false);
        return;
      }

      const [patternList, clipboard, selected] = await Promise.all([
        listAvailablePatterns(),
        Clipboard.readText().catch(() => ""),
        getSelectedText().catch(() => ""),
      ]);

      setPatterns(patternList);
      setClipboardText(clipboard || "");
      setSelectedText(selected || "");
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to load patterns",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      let input = "";

      switch (values.inputSource) {
        case "clipboard":
          input = clipboardText;
          break;
        case "selection":
          input = selectedText;
          break;
        case "manual":
          input = values.input;
          break;
      }

      if (!input) {
        await showToast({
          style: Toast.Style.Failure,
          title: "No input provided",
          message: "Please provide text to process",
        });
        setIsLoading(false);
        return;
      }

      await showToast({
        style: Toast.Style.Animated,
        title: "Running pattern...",
      });

      await addToRecentPatterns(values.pattern);

      const result = await executeFabricPattern(values.pattern, input);

      if (result.success && result.output) {
        switch (values.outputDestination) {
          case "clipboard":
            await Clipboard.copy(result.output);
            await showHUD("✅ Result copied to clipboard");
            break;
          case "replace":
            await Clipboard.paste(result.output);
            await showHUD("✅ Result pasted");
            break;
        }
      } else {
        await showToast({
          style: Toast.Style.Failure,
          title: "Pattern execution failed",
          message: result.error,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="pattern" title="Pattern" storeValue>
        {patterns.map((pattern) => (
          <Form.Dropdown.Item key={pattern} value={pattern} title={pattern} />
        ))}
      </Form.Dropdown>

      <Form.Separator />

      <Form.Dropdown id="inputSource" title="Input Source" storeValue>
        <Form.Dropdown.Item value="clipboard" title="Clipboard" />
        <Form.Dropdown.Item value="selection" title="Selected Text" />
        <Form.Dropdown.Item value="manual" title="Manual Input" />
      </Form.Dropdown>

      <Form.TextArea
        id="input"
        title="Input Text"
        placeholder="Enter text to process (only used if Manual Input is selected)..."
        info="This field is only used when 'Manual Input' is selected above"
      />

      <Form.Separator />

      <Form.Dropdown
        id="outputDestination"
        title="Output Destination"
        storeValue
      >
        <Form.Dropdown.Item value="clipboard" title="Copy to Clipboard" />
        <Form.Dropdown.Item value="replace" title="Replace Selection" />
      </Form.Dropdown>
    </Form>
  );
}
