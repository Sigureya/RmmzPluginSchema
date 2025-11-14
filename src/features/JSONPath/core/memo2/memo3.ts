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
  ValueCategory2,
  PluginValueScalar,
  PluginValuesSA,
  PluginValuesNA,
  ArrayPathMemo,
  PluginValues,
} from "./types";
import type { MemoBundle, PluginValuesPathMemo4 } from "./types/memo3";

export const memo3Ex = (
  category: ValueCategory2,
  structName: string,
  value: JSONValue,
  memo: PluginValuesPathMemo4[]
): PluginValues[] => {
  return memo.flatMap((m) => memo3(category, structName, value, m));
};

export const runMemoBundle = (
  category: ValueCategory2,
  structName: string,
  value: JSONValue,
  memo: MemoBundle
): PluginValues[] => {
  const topValues: PluginValues[] = memo3(
    category,
    structName,
    value,
    memo.top
  );
  const structValues: PluginValues[][] = memo.structs.map((m) =>
    memo3(category, structName, value, m)
  );
  const structArrayValues: PluginValues[][] = memo.structArrays.map((m) =>
    memo3(category, structName, value, m)
  );
  return [topValues, structValues, structArrayValues].flat(2);
};
const memo3 = (
  category: ValueCategory2,
  structName: string,
  value: JSONValue,
  memo: PluginValuesPathMemo4
): PluginValues[] => {
  const svalues: PluginValueScalar[] = memo.scalar
    ? readScalarValueV3(
        category,
        structName,
        value,
        memo.scalar.jsonPathJS,
        memo.scalar.record
      )
    : [];

  const avalues: (PluginValuesSA[] | PluginValuesNA[])[] = memo.arrays.map(
    (arrayMemo) => readArrayValue2(category, value, arrayMemo)
  );
  return [svalues, avalues].flat(2);
};

export const readScalarValueV3 = (
  category: ValueCategory2,
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
      category: category,
      name: structName,
      value: value,
      param: { name: lastSegment, attr: schema },
    });
    return acc;
  }, []);
};

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
