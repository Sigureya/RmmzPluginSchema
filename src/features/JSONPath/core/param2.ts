import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginParamsRecord } from "@RmmzPluginSchema/rmmz/plugin";
import { extractAllPluginValues } from "./extractor/extractor";
import type {
  PluginExtractedValue,
  PluginValuesExtractorBundle,
} from "./extractor/types";

export interface ParamReadHandlers<T> {
  parseError(record: PluginParamsRecord, error: unknown): T;
}

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
  errorHandlers: ParamReadHandlers<T>,
): ParamReadResult<T> => {
  try {
    const parsed = parseFn(record.parameters);
    return {
      pluginName: record.name,
      params: extractAllPluginValues(parsed, paramExtractor),
      errorKind: "",
      errorInfo: null,
    };
  } catch (error) {
    return {
      pluginName: record.name,
      errorKind: "parseError",
      errorInfo: errorHandlers.parseError(record, error),
      params: [],
    };
  }
};
