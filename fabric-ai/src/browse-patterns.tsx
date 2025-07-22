import {
  ActionPanel,
  Action,
  List,
  showToast,
  Toast,
  Icon,
  useNavigation,
  Form,
  Clipboard,
  showHUD,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { FabricPattern, PatternCategory } from "./types";
import {
  listAvailablePatterns,
  executeFabricPattern,
  checkFabricInstallation,
} from "./utils/fabric";
import {
  buildPatternList,
  groupPatternsByCategory,
  getFavoritePatterns,
  toggleFavoritePattern,
  addToRecentPatterns,
  getRecentPatterns,
} from "./utils/patterns";

export default function BrowsePatterns() {
  const [patterns, setPatterns] = useState<FabricPattern[]>([]);
  const [categories, setCategories] = useState<PatternCategory[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadPatterns();
  }, []);

  async function loadPatterns() {
    try {
      setIsLoading(true);

      const isInstalled = await checkFabricInstallation();
      if (!isInstalled) {
        setIsLoading(false);
        return;
      }

      const [patternNames, favs, recent] = await Promise.all([
        listAvailablePatterns(),
        getFavoritePatterns(),
        getRecentPatterns(),
      ]);

      const patternList = await buildPatternList(patternNames);
      setPatterns(patternList);
      setCategories(groupPatternsByCategory(patternList));
      setFavorites(favs);
      setRecents(recent);
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

  async function handleToggleFavorite(patternName: string) {
    await toggleFavoritePattern(patternName);
    const newFavorites = await getFavoritePatterns();
    setFavorites(newFavorites);
  }

  function getFilteredPatterns() {
    if (!searchText) return { favorites, recents, categories };

    const search = searchText.toLowerCase();
    const filtered = patterns.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search),
    );

    const filteredFavorites = favorites.filter((f) =>
      filtered.some((p) => p.name === f),
    );
    const filteredRecents = recents.filter((r) =>
      filtered.some((p) => p.name === r),
    );
    const filteredCategories = groupPatternsByCategory(filtered);

    return {
      favorites: filteredFavorites,
      recents: filteredRecents,
      categories: filteredCategories,
    };
  }

  const {
    favorites: filteredFavorites,
    recents: filteredRecents,
    categories: filteredCategories,
  } = getFilteredPatterns();

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search patterns..."
      onSearchTextChange={setSearchText}
    >
      {filteredFavorites.length > 0 && (
        <List.Section
          title="Favorites"
          subtitle={`${filteredFavorites.length} patterns`}
        >
          {filteredFavorites.map((fav) => {
            const pattern = patterns.find((p) => p.name === fav);
            if (!pattern) return null;
            return (
              <PatternItem
                key={pattern.name}
                pattern={pattern}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            );
          })}
        </List.Section>
      )}

      {filteredRecents.length > 0 && (
        <List.Section
          title="Recent"
          subtitle={`${filteredRecents.length} patterns`}
        >
          {filteredRecents.map((recent) => {
            const pattern = patterns.find((p) => p.name === recent);
            if (!pattern) return null;
            return (
              <PatternItem
                key={pattern.name}
                pattern={pattern}
                isFavorite={favorites.includes(pattern.name)}
                onToggleFavorite={handleToggleFavorite}
              />
            );
          })}
        </List.Section>
      )}

      {filteredCategories.map((category) => (
        <List.Section
          key={category.name}
          title={category.name}
          subtitle={`${category.patterns.length} patterns`}
        >
          {category.patterns.map((pattern) => (
            <PatternItem
              key={pattern.name}
              pattern={pattern}
              isFavorite={favorites.includes(pattern.name)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

function PatternItem({
  pattern,
  isFavorite,
  onToggleFavorite,
}: {
  pattern: FabricPattern;
  isFavorite: boolean;
  onToggleFavorite: (name: string) => void;
}) {
  const { push } = useNavigation();

  return (
    <List.Item
      title={pattern.name}
      subtitle={pattern.description}
      accessories={[
        { text: pattern.category },
        { icon: isFavorite ? Icon.Star : undefined },
      ]}
      actions={
        <ActionPanel>
          <Action
            title="Run Pattern"
            icon={Icon.Play}
            onAction={() => push(<RunPatternForm pattern={pattern} />)}
          />
          <Action
            title="Run on Clipboard"
            icon={Icon.Clipboard}
            onAction={async () => {
              const clipboard = await Clipboard.readText();
              if (!clipboard) {
                await showToast({
                  style: Toast.Style.Failure,
                  title: "No text in clipboard",
                });
                return;
              }
              await executePattern(pattern.name, clipboard);
            }}
          />
          <Action
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            icon={isFavorite ? Icon.StarDisabled : Icon.Star}
            onAction={() => onToggleFavorite(pattern.name)}
            shortcut={{ modifiers: ["cmd"], key: "f" }}
          />
        </ActionPanel>
      }
    />
  );
}

function RunPatternForm({ pattern }: { pattern: FabricPattern }) {
  const { pop } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: { input: string }) {
    setIsLoading(true);
    await executePattern(pattern.name, values.input);
    setIsLoading(false);
    pop();
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
      <Form.TextArea
        id="input"
        title="Input Text"
        placeholder="Enter text to process..."
        autoFocus
      />
    </Form>
  );
}

async function executePattern(patternName: string, input: string) {
  await showToast({
    style: Toast.Style.Animated,
    title: "Running pattern...",
  });

  await addToRecentPatterns(patternName);

  const result = await executeFabricPattern(patternName, input);

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
}
