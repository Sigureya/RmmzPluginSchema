import type { PluginParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { ExtractorBundle } from "./bundle";
import type { PluginValues } from "./result";

export interface PluginParamsSchema {
  pluginName: string;
  schema: {
    params: PluginParam[];
  };
}

export interface PluginParamExtractor {
  pluginName: string;
  extractors: ExtractorBundle[];
}

export interface ParamExtractResult {
  pluginName: string;
  params: PluginValues[];
}
