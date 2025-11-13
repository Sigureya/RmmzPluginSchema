import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath/JSONValue";
import type {
  ArrayParamTypes,
  PluginParamEx,
  ScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  isStringArrayParam,
  isNumberArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type { ArrayPathPair, ValueCategory } from "./createPath/types";
import { readScalarValueV3 } from "./memo2/memo3";
import type { PluginValues } from "./memo2/types";
import type {
  StringSequenceParamValues,
  NumberSequenceParamValues,
} from "./types";

export const extractArrayParamValues = (
  object: JSONValue,
  pair: ArrayPathPair
): null | StringSequenceParamValues | NumberSequenceParamValues => {
  const path = new JSONPathJS(pair.path);
  const values: JSONValue = path.find(object);
  if (!Array.isArray(values)) {
    return null;
  }

  const attr: ArrayParamTypes = pair.param.attr;
  if (isStringArrayParam(attr)) {
    const s: string[] = values.filter((v) => typeof v === "string");
    return {
      values: s,
      valueType: "string",
      param: {
        name: pair.param.name,
        attr: attr,
      },
    };
  }
  if (isNumberArrayParam(attr)) {
    const n: number[] = values.filter((v) => typeof v === "number");
    return {
      values: n,
      valueType: "number",
      param: {
        name: pair.param.name,
        attr: attr,
      },
    };
  }

  return null;
};

export const extractScalaParams = (
  data: JSONValue,
  path: string,
  params: ReadonlyArray<PluginParamEx<ScalarParam>>,
  category: ValueCategory,
  structName: string
): PluginValues[] => {
  const record = Object.fromEntries(
    params.map((param) => [param.name, param.attr] as const)
  );
  const jsonPath = new JSONPathJS(path);
  return readScalarValueV3(
    category,
    structName,
    data,
    jsonPath,

    record
  );
};
