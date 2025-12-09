import type {
  NumberArrayParam,
  NumberArrayUnion,
  PluginArrayParamType,
  PluginParamEx2,
  PluginParamEx3,
  PluginScalarParam,
  StringArrayParam,
  StringArrayUnion,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesExtractorBundle7 } from "./bundle";
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

export interface PluginParamsSchema7<
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayParam
> {
  pluginName: string;
  schema: {
    params: (PluginParamEx2<S, NA> | PluginParamEx2<S, SA>)[];
  };
}

export interface PluginParamExtractor<
  S extends PluginScalarParam = PluginScalarParam,
  NA extends NumberArrayUnion = NumberArrayUnion,
  SA extends StringArrayUnion = StringArrayUnion
> {
  pluginName: string;
  extractors: PluginValuesExtractorBundle7<S, NA, SA>[];
}

export interface ParamExtractResult7<
  S extends PluginScalarParam = PluginScalarParam,
  NA extends NumberArrayUnion = NumberArrayUnion,
  SA extends StringArrayUnion = StringArrayUnion
> {
  pluginName: string;
  params: PluginValues<PluginParamEx3<S, NA, SA>>[];
}

export interface ParamExtractResult<
  S extends PluginScalarParam = PluginScalarParam,
  A extends PluginArrayParamType = PluginArrayParamType
> {
  pluginName: string;
  params: PluginValues<PluginParamEx2<S, A>>[];
}
