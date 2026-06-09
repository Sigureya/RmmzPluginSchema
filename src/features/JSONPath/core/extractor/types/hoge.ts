import type { CommandArgExtractors } from "./command";

export interface PluginCommandExtractorSourceItem {
  commandExtractors: CommandArgExtractors[];
}

export interface PluginCommandExtractorSource {
  plugins: PluginCommandExtractorSourceItem[];
}
