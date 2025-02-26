import { EMPTY_DICTINARY } from "./constants/";
import { lookupDictionary } from "./makeAnnotation";
import { hasStructParams } from "./structHasMember";
import type * as Types from "./types/";

export const makeDefaultValueJSONLike = (
  annotation:
    | Types.AnnotationPrimitiveTypes
    | Types.StructAnnotation_Union<object>,
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
  annotation: Types.StructAnnotation_Union<T>
): T => {
  if (annotation.default !== undefined) {
    return annotation.default;
  }
  return makeDefaultHelper(annotation, () => undefined) as T;
};

const makeDefaultHelper = <T extends object>(
  ant: Types.StructAnnotation_Union<T>,
  fn: (typename: string) => T | undefined,
  depth: number = 0
) => {
  if (ant.default !== undefined) {
    return ant.default;
  }
  if (depth > MAX_RECURSION_DEPTH) {
    throw new Error("Max depth exceeded");
  }

  // // 処理方法の関係上、名前引きの方が速い
  // if (ant.struct.structName !== undefined) {
  //   const result = fn(ant.struct.structName);
  //   if (result !== undefined) {
  //     return result;
  //   }
  // }
  if (!hasStructParams(ant)) {
    throw new Error("struct is invalid");
  }

  // 最後の手段として、paramsを使って生成する
  type Result = Record<string, string | number | boolean | object>;
  return Object.entries<Types.AnnotationTypes>(
    ant.struct.params
  ).reduce<Result>((prev, [key, annotation]) => {
    const value =
      annotation.type === "struct"
        ? makeDefaultHelper(annotation, fn, depth + 1)
        : annotation.default;
    prev[key] = value;
    return prev;
  }, {});
};

const MAX_RECURSION_DEPTH = 32 as const;
