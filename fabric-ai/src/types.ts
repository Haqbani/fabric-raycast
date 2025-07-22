export interface FabricPattern {
  name: string;
  category: string;
  description: string;
  path: string;
}

export interface FabricOptions {
  model?: string;
  temperature?: number;
  stream?: boolean;
  output?: "clipboard" | "file" | "stdout";
  outputFile?: string;
}

export interface FabricResponse {
  success: boolean;
  output?: string;
  error?: string;
}

export interface PatternCategory {
  name: string;
  patterns: FabricPattern[];
}

export const PATTERN_CATEGORIES = {
  ANALYSIS: "Analysis",
  CREATION: "Creation",
  EXTRACTION: "Extraction",
  WRITING: "Writing",
  SECURITY: "Security",
  SPECIALIZED: "Specialized",
} as const;

export type PatternCategoryType =
  (typeof PATTERN_CATEGORIES)[keyof typeof PATTERN_CATEGORIES];
