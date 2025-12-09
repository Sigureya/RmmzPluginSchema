import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginParamsRecord,
  PluginScalarParam,
  NumberArrayParam,
  StringArrayParam,
  ClassifiedPluginParamsEx7,
  StringArrayUnion,
  NumberArrayUnion,
} from "@RmmzPluginSchema/rmmz/plugin";
import { parseDeepRecord } from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPath } from "./createPath";
import { extractAllPluginValues } from "./extractor/extractor";
import type {
  ParamExtractResult,
  ParamExtractResult7,
  PluginParamExtractor,
  PluginParamsSchema,
  PluginValuesExtractorBundle7,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

export const extractPluginParamFromRecord = <
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayParam
>(
  record: PluginParamsRecord,
  paramExtractor: ReadonlyArray<PluginValuesExtractorBundle7<S, NA, SA>>
): ParamExtractResult<S, NA | SA> => {
  const parsed: Record<string, JSONValue> = parseDeepRecord(record.parameters);
  return {
    pluginName: record.name,
    params: extractAllPluginValues<S, NA, SA>(parsed, paramExtractor),
  };
};

export const extractPluginParam = <
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayParam
>(
  value: JSONValue,
  paramExtractor: PluginParamExtractor<S, NA, SA>
): ParamExtractResult7<S, NA, SA> => {
  return {
    pluginName: paramExtractor.pluginName,
    params: extractAllPluginValues(value, paramExtractor.extractors),
  };
};

// const xxx = <S extends PluginScalarParam, A extends PluginArrayParamType>(
//   plugin: PluginSchemaOf<S, A>,
//   record: PluginParamsRecord,
//   factoryFn: (path: string) => JSONPathReader
// ) => {
//   const map = createClassifiedStructMap(plugin.schema.structs);
//   const e = compilePluginParamExtractor(plugin, map, factoryFn);
//   const result = extractPluginParamFromRecord(record, e.extractors);
//   return {
//     pluginName: e.pluginName,
//     params: result.params,
//     structMap: map,
//   };
// };

export const compilePluginParamExtractor = <
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  plugin: PluginParamsSchema<S, NA | SA>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>,
  factoryFn: (path: string) => JSONPathReader
): PluginParamExtractor<S, NA, SA> => {
  return {
    pluginName: plugin.pluginName,
    extractors: plugin.schema.params.map((param) => {
      const path = createPluginValuesPath("param", "plugin", param, structMap);
      return compileJSONPathSchema<S, NA, SA>(path, factoryFn);
    }),
  };
};
