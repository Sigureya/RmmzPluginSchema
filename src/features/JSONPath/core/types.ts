import type { CommandExtractorEntry, ExtractorBundle } from "./extractor/types";

export interface PluginExtractorBundle {
  pluginName: string;
  params: ExtractorBundle[];
  commands: CommandExtractorEntry[];
}
