import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import { parseDeepJSON, parseDeepRecord, type PluginSchema } from "./core";
import { compilePluginToObject } from "./core/compilePlugin";
import type { CCC } from "./core/compilePluginAsArraySchema";
import { compilePluginAsArraySchema } from "./core/compilePluginAsArraySchema";
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
  fn: (structDefault: string, category: CCC) => unknown = (s: string) =>
    parseDeepJSON(s)
): PluginSchema => {
  const tokens: ParsedPlugin = parsePlugin(input.source, input.locale);
  return {
    meta: tokens.meta,
    pluginName: input.pluginName,
    target: "MZ",
    schema: compilePluginAsArraySchema(tokens, fn),
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
