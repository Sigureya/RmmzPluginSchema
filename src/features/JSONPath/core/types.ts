import type {
  PluginScalarParam,
  PluginArrayParamType,
  PluginParam,
  ClassifiedPluginParamsEx2,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  CommandExtractorEntry,
  PluginValues,
  PluginValuesExtractorBundle,
} from "./extractor/types";

export interface PluginExtractorBundle {
  pluginName: string;
  params: PluginValuesExtractorBundle[];
  commands: CommandExtractorEntry[];
}

export interface X<
  S extends PluginScalarParam,
  A extends PluginArrayParamType
> {
  pluginName: string;
  params: PluginValues<PluginParam>[];
  structMap: Map<string, ClassifiedPluginParamsEx2<S, A>>;
}
