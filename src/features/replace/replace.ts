import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginParamsObject } from "@RmmzPluginSchema/rmmz/plugin";
import type { ReplaceHandler } from "./handlers";

const normalizePluginName = (name: string): string => {
  if (name.length === 0) {
    return name;
  }
  return `${name[0]?.toLowerCase() ?? ""}${name.slice(1)}`;
};

const replaceStringValue = (
  value: string,
  path: string,
  handlers: ReplaceHandler,
): string => {
  const nextValue = handlers.findNewText(path, value);
  return nextValue ?? value;
};

const replaceJSONValue = (
  value: JSONValue,
  path: string,
  handlers: ReplaceHandler,
): JSONValue => {
  if (handlers.tansaStop(path)) {
    return value;
  }
  if (typeof value === "string") {
    return replaceStringValue(value, path, handlers);
  }
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      replaceJSONValue(item, `${path}[${index}]`, handlers),
    );
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => {
        return [key, replaceJSONValue(child, `${path}.${key}`, handlers)];
      }),
    );
  }
  return value;
};

export const replaceXXX = (
  plugin: PluginParamsObject,
  handlers: ReplaceHandler,
): PluginParamsObject => {
  const pluginName = normalizePluginName(plugin.name);
  return {
    ...plugin,
    parameters: Object.fromEntries(
      Object.entries(plugin.parameters).map(([key, value]) => {
        return [key, replaceJSONValue(value, `${pluginName}:${key}`, handlers)];
      }),
    ),
  };
};
