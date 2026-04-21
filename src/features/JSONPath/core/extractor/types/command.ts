import type { PluginValuesExtractorBundle } from "./bundle";
import type { PluginExtractedValue } from "./result";

export interface CommandArgExtractors {
  pluginName: string;
  commandName: string;
  desc: string;
  text: string;
  extractors: PluginValuesExtractorBundle[];
}

export interface CommandExtractResult {
  pluginName: string;
  commandName: string;
  args: PluginExtractedValue[];
}

export type CommandMapKey = `${string}:${string}`;
export type CommandExtractorEntry = [CommandMapKey, CommandArgExtractors];
