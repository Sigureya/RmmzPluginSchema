import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import type { PrimitiveParam } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import { extractArrayParamValues } from "./extractParam";
import type { StructPropertysPath } from "./types/pathSchemaTypes";
import type {
  ScalarPathResult,
  StringSequenceParamValues,
  NumberSequenceParamValues,
} from "./types/result";

export const extractScalarValuesFromJson = (
  json: JSONValue,
  structPath: StructPropertysPath
): ScalarPathResult[] => {
  if (!structPath.scalas) {
    return [];
  }
  const jsonPath = new JSONPathJS(structPath.scalas);
  const segments = jsonPath.pathSegments(json);
  return collectScalarResults(segments, structPath, structPath.structName);
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
): ScalarPathResult[] => {
  return segments.reduce<ScalarPathResult[]>((acc, { segments, value }) => {
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

    const result: ScalarPathResult = {
      value: value,
      structName: structName,
      param: { name: paramName, attr: schema },
    };
    return [...acc, result];
  }, []);
};

export const extractArrayValuesFromJson = (
  json: JSONValue,
  structPath: StructPropertysPath
): (StringSequenceParamValues | NumberSequenceParamValues)[] => {
  return structPath.scalaArrays
    .map((scalaArray) => {
      return extractArrayParamValues(json, scalaArray);
    })
    .filter((v) => v !== null);
};
