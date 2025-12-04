import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ArrayParamTypes,
  ClassifiedPluginParamsEx2,
  PluginParamsRecord,
  ScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  createClassifiedStructMap,
  parseDeepRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginSchemaOf } from "@RmmzPluginSchema/rmmz/plugin/core/pluginJSON2type";
import { createPluginValuesPath } from "./createPath";
import { extractAllPluginValues } from "./extractor/extractor";
import type {
  ExtractorBundle,
  ParamExtractResult,
  PluginParamExtractor,
  PluginParamsSchema,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

export const extractPluginParamFromRecord = (
  record: PluginParamsRecord,
  paramExtractor: ReadonlyArray<ExtractorBundle>
): ParamExtractResult => {
  const parsed: Record<string, JSONValue> = parseDeepRecord(record.parameters);
  return {
    pluginName: record.name,
    params: extractAllPluginValues(parsed, paramExtractor),
  };
};

export const extractPluginParam = (
  value: JSONValue,
  paramExtractor: PluginParamExtractor
): ParamExtractResult => {
  return {
    pluginName: paramExtractor.pluginName,
    params: extractAllPluginValues(value, paramExtractor.extractors),
  };
};

const xxx = <S extends ScalarParam, A extends ArrayParamTypes>(
  plugin: PluginSchemaOf<S, A>,
  record: PluginParamsRecord,
  factoryFn: (path: string) => JSONPathReader
) => {
  const map = createClassifiedStructMap(plugin.schema.structs);
  const e = compilePluginParamExtractor(plugin, map, factoryFn);
  const result = extractPluginParamFromRecord(record, e.extractors);
  return {
    pluginName: e.pluginName,
    params: result.params,
    structMap: map,
  };
};

export const compilePluginParamExtractor = <
  S extends ScalarParam,
  A extends ArrayParamTypes
>(
  plugin: PluginParamsSchema<S, A>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>,
  factoryFn: (path: string) => JSONPathReader
): PluginParamExtractor => {
  return {
    pluginName: plugin.pluginName,
    extractors: plugin.schema.params.map((param) => {
      const path = createPluginValuesPath("param", "plugin", param, structMap);
      return compileJSONPathSchema(path, factoryFn);
    }),
  };
};
