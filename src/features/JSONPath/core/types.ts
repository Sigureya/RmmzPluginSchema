import type { CommandExtractorEntry } from "./commandTypes";
import type { ExtractorBundle } from "./extractor/types/bundle";

export interface PluginExtractorBundle {
  params: ExtractorBundle[];
  commands: CommandExtractorEntry[];
}
