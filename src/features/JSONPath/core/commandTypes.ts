import type { ExtractorBundle, PluginValues } from "./extractor/types";

export interface CommandArgExtractors {
  pluginName: string;
  commandName: string;
  desc: string;
  text: string;
  extractors: ExtractorBundle[];
}

export interface CommandExtracrResult {
  pluginName: string;
  commandName: string;
  values: PluginValues[];
}

export type CommandMapKey = `${string}:${string}`;
export type CommandPairXXX = [CommandMapKey, CommandArgExtractors];
