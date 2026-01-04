import type { PluginStructBlock } from "../types";

export interface LLResult {
  unlocale: PluginStructBlock[];
  localeMap: Record<string, PluginStructBlock[]>;
}
