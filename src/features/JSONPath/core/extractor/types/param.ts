import type {
  ArrayParamTypes,
  PluginParamEx2,
  ScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ExtractorBundle } from "./bundle";
import type { PluginValues } from "./result";

export interface PluginParamsSchema<
  S extends ScalarParam,
  A extends ArrayParamTypes
> {
  pluginName: string;
  schema: {
    params: PluginParamEx2<S, A>[];
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
