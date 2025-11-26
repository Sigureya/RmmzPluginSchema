import { parseDeepRecord, type PluginSchema } from "./core";
import { compilePluginToObject } from "./core/compilePlugin";
import { compilePluginAsArraySchema } from "./core/compilePluginAsArraySchema";
import type { ParsedPlugin } from "./core/parse";
import { parsePlugin } from "./core/parse/parse";
import type { PluginJSON } from "./core/pluginJSONTypes";
import { parsePluginParamRecord } from "./pluginsJS/jsToJSON";
import type { PluginParamsObject } from "./pluginsJS/types";

export const pluginSourceToJSON = (text: string): PluginJSON => {
  return compilePluginToObject(text);
};

export const pluginSourceToArraySchema = (
  plguinName: string,
  text: string
): PluginSchema => {
  const tokens: ParsedPlugin = parsePlugin(text);
  return {
    meta: tokens.meta,
    pluginName: plguinName,
    target: "MZ",
    schema: compilePluginAsArraySchema(tokens),
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
