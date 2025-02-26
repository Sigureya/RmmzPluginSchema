import { EMPTY_DICTINARY } from "./constants/";
import { lookupDictionary } from "./makeAnnotation";
import type * as Types from "./types/";
import type { StructAnnotation } from "./types/";

export const makeDefaultValue = (
  annotation:
    | Types.AnnotationPrimitiveTypes
    | Types.StructAnnotationBase_WithType,
  dic: Types.Dictionary = EMPTY_DICTINARY
): string => {
  switch (annotation.type) {
    case "file":
      return annotation.default;
    case "struct":
      return stringify(makeDefaultStruct(annotation));
    case "string[]":
      return stringify(annotation.default.map((s) => lookupDictionary(s, dic)));
  }
  if (typeof annotation.default === "string") {
    return lookUp(annotation, dic);
  }

  return stringify(annotation.default);
};
/**
 * @description JSON.stringify("string")すると面倒なJSONになるので、こうやって予防する
 * @param value
 * @returns
 */
const stringify = <T>(value: Exclude<T, string>): string => {
  return JSON.stringify(value, null, 0);
};

const lookUp = (
  ant: Exclude<Types.Primitive_Strings, Types.FilePathAnnotation>,
  dic: Types.Dictionary
): string => {
  if (ant.type === "select") {
    // select is not text.
    return ant.default;
  }
  return lookupDictionary(ant.default, dic);
};
export const makeDefaultStruct = <T extends object>(
  annotation: StructAnnotation<T>
): T => {
  return annotation.default === undefined
    ? (makeDefaultHelper(annotation, () => undefined) as T)
    : annotation.default;
};

const makeDefaultHelper = <T extends object>(
  ant: StructAnnotation<T> | Types.AnnotationPrimitiveTypes,
  fn: (typename: string) => T | undefined,
  depth: number = 0
) => {
  if (depth > MAX_RECURSION_DEPTH) {
    throw new Error("Max depth exceeded");
  }

  if (ant.default !== undefined) {
    return ant.default;
  }
  if (ant.type !== "struct" || ant.struct === undefined) {
    throw new Error(`unknown type:${ant.type}`, {
      cause: ant,
    });
  }
  // 処理方法の関係上、名前引きの方が速い
  if (ant.struct.structName !== undefined) {
    const result = fn(ant.struct.structName);
    if (result !== undefined) {
      return result;
    }
  }
  if (ant.struct.params === undefined) {
    throw new Error("struct is invalid");
  }

  // 最後の手段として、paramsを使って生成する
  type Result = Record<string, unknown>;
  return Object.entries(ant.struct.params).reduce<Result>((prev, v) => {
    prev[v[0]] = makeDefaultHelper(v[1] as typeof ant, fn, depth + 1);
    return prev;
  }, {});
};

const MAX_RECURSION_DEPTH = 32 as const;
