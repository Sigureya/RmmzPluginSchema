import type { ExtractorBundle } from "./bundle";
import type { PluginValues } from "./result";

export interface PluginParamExtractor {
  pluginName: string;
  extractors: ExtractorBundle[];
}

export interface ParamExtractResult {
  pluginName: string;
  params: PluginValues[];
}
