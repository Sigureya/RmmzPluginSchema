import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PrimitiveParam,
  PluginParamEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  isStringArrayParam,
  isNumberArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  ValueCategory2,
  ArrayPathMemo,
  PluginValuesSA,
  PluginValuesNA,
} from "./types";

export const readArrayValue2 = (
  category: ValueCategory2,
  json: JSONValue,
  path: ArrayPathMemo
): PluginValuesSA[] | PluginValuesNA[] => {
  const values: JSONValue = path.jsonPathJS.find(json);
  if (!Array.isArray(values)) {
    return [];
  }
  const attr = path.schema.attr;
  if (isStringArrayParam(attr)) {
    const s: string[] = values.filter((v) => typeof v === "string");
    type ParamType = Extract<PrimitiveParam, { default: string[] }>;
    return s.map(
      (value): PluginValuesSA => ({
        value: value,
        category: category,
        name: path.schema.name,
        param: path.schema as PluginParamEx<ParamType>,
      })
    );
  }
  if (isNumberArrayParam(attr)) {
    const s: number[] = values.filter((v) => typeof v === "number");
    type ParamType = Extract<PrimitiveParam, { default: number[] }>;
    return s.map(
      (value): PluginValuesNA => ({
        value: value,
        category: category,
        name: path.schema.name,
        param: path.schema as PluginParamEx<ParamType>,
      })
    );
  }
  return [];
};
