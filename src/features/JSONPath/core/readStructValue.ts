import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath/JSONValue";
import type { PrimitiveParam } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type { StructPropertysPath } from "./createPath/pathSchemaTypes";
import { extractArrayParamValues } from "./extractParam";
import type { PluginValues } from "./memo2/types";
import type {
  StringSequenceParamValues,
  NumberSequenceParamValues,
} from "./types/result";

export const extractScalarValuesFromJson = (
  json: JSONValue,
  structPath: StructPropertysPath
): PluginValues[] => {
  if (!structPath.scalars) {
    return [];
  }
  const jsonPath = new JSONPathJS(structPath.scalars);
  const segments = jsonPath.pathSegments(json);
  return collectScalarResults(segments, structPath, structPath.name);
};

interface PathSegment {
  value: JSONValue;
  segments: (string | number)[];
}

/**
 * セグメント配列からScalaPathResult配列を生成する
 */
export const collectScalarResults = (
  segments: ReadonlyArray<PathSegment>,
  structPath: StructPropertysPath,
  structName: string
): PluginValues[] => {
  return segments.reduce<PluginValues[]>((acc, { segments, value }) => {
    if (typeof value === "object") {
      return acc;
    }
    const paramName = segments[segments.length - 1];
    if (typeof paramName === "number") {
      return acc;
    }

    const schema: PrimitiveParam | undefined =
      structPath.objectSchema[paramName];
    if (!schema) {
      return acc;
    }

    const result: PluginValues = {
      category: structPath.category,
      value: value,
      name: structName,
      param: { name: paramName, attr: schema },
    };
    return [...acc, result];
  }, []);
};

export const extractArrayValuesFromJson = (
  json: JSONValue,
  structPath: StructPropertysPath
): (StringSequenceParamValues | NumberSequenceParamValues)[] => {
  return structPath.scalarArrays
    .map((scalaArray) => {
      return extractArrayParamValues(json, scalaArray);
    })
    .filter((v) => v !== null);
};
