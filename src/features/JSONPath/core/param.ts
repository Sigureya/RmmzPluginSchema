import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type { ClassifiedPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPath } from "./createPath";
import { extractAllPluginValues } from "./extractor/extractor";
import type {
  ParamExtractResult,
  PluginParamExtractor,
  PluginParamsSchema,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

export const extractPluginParam = (
  value: JSONValue,
  paramExtractor: PluginParamExtractor
): ParamExtractResult => {
  return {
    pluginName: paramExtractor.pluginName,
    params: extractAllPluginValues(value, paramExtractor.extractors),
  };
};

export const compilePluginParamExtractor = (
  plugin: PluginParamsSchema,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
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
