import type { PluginSchema, PluginSchemaArray } from "./core";
import { compilePluginToObject } from "./core/compilePlugin";
import { compilePluginAsArraySchema } from "./core/compilePluginAsArraySchema";
import { parsePlugin } from "./core/parse/parse";
import type { PluginJSON } from "./core/pluginJSONTypes";

export const pluginSourceToJSON = (text: string): PluginJSON => {
  return compilePluginToObject(text);
};

export const pluginSourceToArraySchema = (
  plguinName: string,
  text: string
): PluginSchema => {
  const tokens = parsePlugin(text);
  return {
    meta: tokens.meta,
    pluginName: plguinName,
    target: "MZ",
    schema: compilePluginAsArraySchema(tokens),
  };
};
