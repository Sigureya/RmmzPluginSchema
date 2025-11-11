import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
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
import type { ValueCategory } from "./createPath/pathSchemaTypes";
import type { ArrayPathPair } from "./createPath/types/query";
import type { PluginValues } from "./memo2/types";
import type {
  StringSequenceParamValues,
  NumberSequenceParamValues,
} from "./types/result";

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
  const map = new Map(params.map((param) => [param.name, param.attr] as const));
  const jsonPath = new JSONPathJS(path);
  const values = jsonPath.pathSegments(data);
  return values.reduce<PluginValues[]>((acc, { value, segments }) => {
    if (typeof value === "object") {
      return acc;
    }
    const lastSegment = segments[segments.length - 1];
    if (typeof lastSegment === "number") {
      return acc;
    }
    const schema = map.get(lastSegment);
    if (!schema) {
      return acc;
    }
    acc.push({
      category: category,
      name: structName,
      value: value,
      param: { name: lastSegment, attr: schema },
    });
    return acc;
  }, []);
};
