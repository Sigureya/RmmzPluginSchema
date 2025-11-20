import type { ExtractorBundle, PluginValues } from "./extractor/types";

export interface CommandArgExtractors {
  pluginName: string;
  commandName: string;
  desc: string;
  text: string;
  extractors: ExtractorBundle[];
}

export interface CommandExtractResult {
  pluginName: string;
  commandName: string;
  values: PluginValues[];
}

export type CommandMapKey = `${string}:${string}`;
export type CommandExtractorEntry = [CommandMapKey, CommandArgExtractors];
