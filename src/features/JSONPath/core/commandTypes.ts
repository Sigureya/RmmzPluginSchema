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
