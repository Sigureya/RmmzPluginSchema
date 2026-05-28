import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ClassifiedPluginParamsTyped,
  PluginArrayParamType,
  PluginParamsRecord,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  PluginParamReadErrorHandlers,
  PluginParamReadContext,
} from "@RmmzPluginSchema/rmmz/plugin/pluginsJS/types/handlers";
import { createPluginValuesPath } from "./createPath";
import { extractAllPluginValues } from "./extractor/extractor";
import type {
  PluginExtractedValue,
  PluginParamExtractor,
  PluginParamsSchema,
  PluginValuesExtractorBundle,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

export interface ParamReadResult<T> {
  errorInfo: T | null;
  pluginName: string;
  params: PluginExtractedValue[];
  errorKind: "parseError" | "";
}

export const extractPluginParamFromRecord = <T>(
  record: PluginParamsRecord,
  paramExtractor: ReadonlyArray<PluginValuesExtractorBundle>,
  parseFn: (value: Record<string, string>) => Record<string, JSONValue>,
  errorHandlers: PluginParamReadErrorHandlers<T>,
): ParamReadResult<T> => {
  const context: PluginParamReadContext = {
    pluginName: record.name,
    record,
  };
  try {
    const parsed = parseFn(record.parameters);
    return {
      pluginName: context.pluginName,
      params: extractAllPluginValues(parsed, paramExtractor),
      errorKind: "",
      errorInfo: null,
    };
  } catch (error) {
    return {
      pluginName: context.pluginName,
      errorKind: "parseError",
      errorInfo: errorHandlers.pluginParamsParseError(context, error),
      params: [],
    };
  }
};

export const compilePluginParamExtractor = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
>(
  plugin: PluginParamsSchema<S, A>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsTyped<S, A>>,
  factoryFn: (path: string) => JSONPathReader,
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
