import { lookupDictionary } from "./makeAnnotation";
import type * as Types from "./types/";

// const isNotTextType = (annotation: Types.AnnotationTypes) => {
//   return annotation.type === "file" || annotation.type === "";
// };

// selectは差し替えない。おそらくenum的に使われており、テキストではない
// comboは差し替える。まあテキストでしょう
// fileは差し替えない

export const makeDefaultValue = (
  annotation: Types.AnnotationTypes,
  dic: Types.Dictionary = {}
): string => {
  // ファイル名はそのまま。変換テーブルで差し替えると危険なので
  if (annotation.type === "file") {
    return makeDefault(annotation);
  }
  const value = makeDefault(annotation);
  return typeof value === "string"
    ? lookupDictionary(value, dic)
    : JSON.stringify(value, null, 0);
};

export const makeDefault = <T extends Types.AnnotationTypes>(
  annotation: T
): NonNullable<T["default"]> => {
  return annotation.default === undefined
    ? makeDefaultHelper(annotation)
    : annotation.default;
};

const makeDefaultHelper = (annotation: Types.AnnotationTypes, depth = 0) => {
  if (depth > 32) {
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
