import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginArrayParamType,
  ClassifiedPluginParamsEx2,
  PluginParamsRecord,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { parseDeepRecord } from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPath } from "./createPath";
import { extractAllPluginValues } from "./extractor/extractor";
import type {
  PluginValuesExtractorBundle,
  ParamExtractResult,
  PluginParamExtractor,
  PluginParamsSchema,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

export const extractPluginParamFromRecord = (
  record: PluginParamsRecord,
  paramExtractor: ReadonlyArray<PluginValuesExtractorBundle>
): ParamExtractResult => {
  const parsed: Record<string, JSONValue> = parseDeepRecord(record.parameters);
  return {
    pluginName: record.name,
    params: extractAllPluginValues(parsed, paramExtractor),
  };
};

export const extractPluginParam = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  value: JSONValue,
  paramExtractor: PluginParamExtractor<S, A>
): ParamExtractResult => {
  return {
    pluginName: paramExtractor.pluginName,
    params: extractAllPluginValues(value, paramExtractor.extractors),
  };
};

export const compilePluginParamExtractor = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  plugin: PluginParamsSchema<S, A>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>,
  factoryFn: (path: string) => JSONPathReader
): PluginParamExtractor<S, A> => {
  type BundlerType = PluginValuesExtractorBundle<S, A>;
  return {
    pluginName: plugin.pluginName,
    extractors: plugin.schema.params.map((param): BundlerType => {
      const path = createPluginValuesPath("param", "plugin", param, structMap);
      return compileJSONPathSchema(path, factoryFn);
    }),
  };
};
