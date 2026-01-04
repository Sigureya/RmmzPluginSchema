import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginSchema } from "./core";
import { parseDeepRecord } from "./core";
import { compilePluginToObject } from "./core/compilePlugin";
import { compilePluginAsArraySchema } from "./core/compilePluginAsArraySchema";
import type { DeepJSONParserHandlers } from "./core/deepJSONHandler";
import { createDeepJSONParserHandlers } from "./core/deepJSONHandler";
import type { ParsedPlugin } from "./core/parse";
import { parsePlugin } from "./core/parse/parse";
import type { PluginJSON } from "./core/pluginJSONTypes";
import { parsePluginParamRecord } from "./pluginsJS/jsToJSON";
import type { PluginParamsObject, PluginParamsRecord } from "./pluginsJS/types";
import type { PluginInput } from "./types";

export const paramObjectFromPluginRecord = (
  record: PluginParamsRecord
): Record<string, JSONValue> => {
  return parseDeepRecord(record.parameters);
};

export const pluginSourceToJSON = (text: string): PluginJSON => {
  return compilePluginToObject(text);
};

export const pluginSourceToArraySchema = (
  input: PluginInput,
  parser: DeepJSONParserHandlers = createDeepJSONParserHandlers()
): PluginSchema => {
  const tokens: ParsedPlugin = parsePlugin(input.source, input.locale);
  return {
    locale: input.locale,
    meta: tokens.meta,
    pluginName: input.pluginName,
    target: "MZ",
    schema: compilePluginAsArraySchema(tokens, parser),
  };
};

export const parsePluginParamObject = (src: string): PluginParamsObject[] => {
  return parsePluginParamRecord(src).map(
    (item): PluginParamsObject => ({
      description: item.description,
      name: item.name,
      status: item.status,
      parameters: parseDeepRecord(item.parameters),
    })
  );
};
