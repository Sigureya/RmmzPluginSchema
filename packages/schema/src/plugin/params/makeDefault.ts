import { EMPTY_DICTINARY } from "./constants";
import { lookupDictionary } from "./makeAnnotation";
import type * as Types from "./types/";

export const makeDefaultValue = (
  annotation: Types.AnnotationTypes,
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
  ant: Exclude<
    Extract<Types.AnnotationTypes, { default: string }>,
    Types.FilePathAnnotation
  >,
  dic: Types.Dictionary
): string => {
  if (ant.type === "select") {
    // select is not text.
    return ant.default;
  }
  return lookupDictionary(ant.default, dic);
};
export const makeDefaultStruct = <T extends object>(
  annotation: Types.Type_Struct<T>
): T => {
  return annotation.default === undefined
    ? (makeDefaultHelper(annotation) as T)
    : annotation.default;
};
const MAX_RECURSION_DEPTH = 32 as const;
const makeDefaultHelper = (annotation: Types.AnnotationTypes, depth = 0) => {
  if (depth > MAX_RECURSION_DEPTH) {
    throw new Error("Max depth exceeded");
  }

  if (annotation.type === "struct") {
    type Result = Record<string, unknown>;
    return Object.entries(annotation.struct.params).reduce<Result>(
      (prev, v) => {
        prev[v[0]] = makeDefaultHelper(
          v[1] as Types.AnnotationTypes,
          depth + 1
        );
        return prev;
      },
      {}
    );
  }
  return annotation.default;
};
