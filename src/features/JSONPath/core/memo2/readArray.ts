import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import {
  isNumberArrayParam,
  isStringArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ValueCategory2 } from "./types";
import type { PluginValuesNA, PluginValuesSA } from "./types/array";
import type { ArrayPathEx } from "./types/memo";

export const readArrayValue2 = (
  category: ValueCategory2,
  json: JSONValue,
  path: ArrayPathEx
): PluginValuesSA[] | PluginValuesNA[] => {
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
  if (isNumberArrayParam(attr)) {
    const s: number[] = values.filter((v) => typeof v === "number");
    return s.map(
      (value): PluginValuesNA => ({
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
