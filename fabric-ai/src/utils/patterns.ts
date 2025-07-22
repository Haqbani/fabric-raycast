import { FabricPattern, PatternCategory } from "../types";
import { getPatternDescription, categorizePattern } from "./fabric";
import { LocalStorage } from "@raycast/api";

export async function getFavoritePatterns(): Promise<string[]> {
  try {
    const stored = await LocalStorage.getItem<string>("favoritePatterns");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function toggleFavoritePattern(
  patternName: string,
): Promise<void> {
  const favorites = await getFavoritePatterns();
  const index = favorites.indexOf(patternName);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(patternName);
  }

  await LocalStorage.setItem("favoritePatterns", JSON.stringify(favorites));
}

export async function getRecentPatterns(): Promise<string[]> {
  try {
    const stored = await LocalStorage.getItem<string>("recentPatterns");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function addToRecentPatterns(patternName: string): Promise<void> {
  const recents = await getRecentPatterns();
  const filtered = recents.filter((p) => p !== patternName);
  filtered.unshift(patternName);

  const limited = filtered.slice(0, 10);
  await LocalStorage.setItem("recentPatterns", JSON.stringify(limited));
}

export async function buildPatternList(
  patterns: string[],
): Promise<FabricPattern[]> {
  const patternPromises = patterns.map(async (name) => {
    const description = await getPatternDescription(name);
    const category = categorizePattern(name);

    return {
      name,
      category,
      description,
      path: `~/.config/fabric/patterns/${name}`,
    };
  });

  return Promise.all(patternPromises);
}

export function groupPatternsByCategory(
  patterns: FabricPattern[],
): PatternCategory[] {
  const grouped = patterns.reduce(
    (acc, pattern) => {
      if (!acc[pattern.category]) {
        acc[pattern.category] = {
          name: pattern.category,
          patterns: [],
        };
      }
      acc[pattern.category].patterns.push(pattern);
      return acc;
    },
    {} as Record<string, PatternCategory>,
  );

  return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
}

export const TOP_PATTERNS = [
  "summarize",
  "extract_wisdom",
  "analyze_claims",
  "create_quiz",
  "write_essay",
  "improve_writing",
  "extract_article_wisdom",
  "create_summary",
  "analyze_paper",
  "create_mermaid_visualization",
  "extract_insights",
  "create_security_update",
  "write_latex",
  "analyze_threat_report",
  "create_presentation",
  "extract_predictions",
  "create_keynote",
  "summarize_newsletter",
  "create_video_summary",
  "extract_references",
];
