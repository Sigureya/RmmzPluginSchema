import type {
  JSONValue,
  JSONPathReader,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ScalarParam,
  PrimitiveParam,
  PluginParamEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  isStringArrayParam,
  isNumberArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  PluginValueScalar,
  PluginValuesSA,
  PluginValuesNA,
  ArrayPathMemo,
  PluginValues,
} from "./types";
import type { MemoBundle, PluginValuesPathMemo4 } from "./types/memo3";

export const runMemoBundle = (
  value: JSONValue,
  memo: MemoBundle
): PluginValues[] => {
  const topValues: PluginValues[] = memo.top
    ? extractFromStruct(memo, value, memo.top)
    : [];
  const structValues: PluginValues[][] = memo.structs.map((m) =>
    extractFromStruct(memo, value, m)
  );
  const structArrayValues: PluginValues[][] = memo.structArrays.map((m) =>
    extractFromStruct(memo, value, m)
  );
  return [topValues, structValues, structArrayValues].flat(2);
};

const extractFromStruct = (
  bundle: MemoBundle,
  value: JSONValue,
  memo: PluginValuesPathMemo4
): PluginValues[] => {
  const structName = memo.bundleName;
  const svalues: PluginValueScalar[] = memo.scalar
    ? readScalarValueV3(
        bundle,
        structName,
        value,
        memo.scalar.jsonPathJS,
        memo.scalar.record
      )
    : [];

  const avalues: (PluginValuesSA[] | PluginValuesNA[])[] = memo.arrays.map(
    (arrayMemo) => readArrayValue2(bundle, structName, value, arrayMemo)
  );
  return [svalues, avalues].flat(2);
};

const readScalarValueV3 = (
  bundle: MemoBundle,
  structName: string,
  json: JSONValue,
  jsonPath: JSONPathReader,
  record: Record<string, ScalarParam>
): PluginValueScalar[] => {
  const values = jsonPath.pathSegments(json);
  return values.reduce<PluginValueScalar[]>((acc, { value, segments }) => {
    if (typeof value === "object") {
      return acc;
    }
    const lastSegment = segments[segments.length - 1];
    if (typeof lastSegment === "number") {
      return acc;
    }
    const schema = record[lastSegment];
    if (!schema) {
      return acc;
    }
    acc.push({
      roootName: bundle.rootName,
      rootType: bundle.rootCategory,
      category: "struct",
      name: structName,
      value: value,
      param: { name: lastSegment, attr: schema },
    });
    return acc;
  }, []);
};

const readArrayValue2 = (
  bundle: MemoBundle,
  groupName: string,
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
        category: "struct",
        rootType: bundle.rootCategory,
        roootName: bundle.rootName,
        name: groupName,
        param: path.schema as PluginParamEx<ParamType>,
      })
    );
  }
  if (isNumberArrayParam(attr)) {
    const s: number[] = values.filter((v) => typeof v === "number");
    type ParamType = Extract<PrimitiveParam, { default: number[] }>;
    return s.map(
      (value): PluginValuesNA => ({
        roootName: bundle.rootName,
        rootType: bundle.rootCategory,
        value: value,
        category: "struct",
        name: groupName,
        param: path.schema as PluginParamEx<ParamType>,
      })
    );
  }
  return [];
};
