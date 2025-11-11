import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import { isStringArrayParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesSA, ValueCategory2 } from "./types/array";
import type { ArrayPathEx } from "./types/memo";

export const readArrayValue2 = (
  category: ValueCategory2,
  json: JSONValue,
  path: ArrayPathEx
): PluginValuesSA[] => {
  const values: JSONValue = path.jsonPathJS.find(json);
  if (!Array.isArray(values)) {
    return [];
  }
  const attr = path.schema.attr;
  if (isStringArrayParam(attr)) {
    const s: string[] = values.filter((v) => typeof v === "string");
    return s.map(
      (value): PluginValuesSA => ({
        value: value,
        category: category,
        name: path.schema.name,
        param: {
          name: path.schema.name,
          attr: attr,
        },
      })
    );
  }
  return [];
};
