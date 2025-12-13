import type {
  PluginArrayParamType,
  PluginParamEx2,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesExtractorBundle } from "./bundle";
import type { PluginValues } from "./result";

export interface PluginParamsSchema<
  S extends PluginScalarParam,
  A extends PluginArrayParamType
> {
  pluginName: string;
  schema: {
    params: PluginParamEx2<S, A>[];
  };
}

export interface PluginParamExtractor<
  S extends PluginScalarParam,
  A extends PluginArrayParamType
> {
  pluginName: string;
  extractors: PluginValuesExtractorBundle<S, A>[];
}

export interface ParamExtractResult {
  pluginName: string;
  params: PluginValues[];
}
