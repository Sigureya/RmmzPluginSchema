import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import { isStringArrayParam } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type { ArrayPathEx, PathPair, ValueCategory } from "../types";
import type { PluginValuesSA } from "./resultTypes";

const x = (pathPair: PathPair): ArrayPathEx => ({
  jsonPathJS: new JSONPathJS(pathPair.path),
  schema: pathPair.param,
});

const r = (
  category: ValueCategory,
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
