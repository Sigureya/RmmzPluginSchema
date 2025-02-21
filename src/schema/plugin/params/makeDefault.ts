import type * as Types from "./types/";

export const makeDefault = <T extends Types.AnnotationTypes>(
  ant: T
): NonNullable<T["default"]> => {
  return makeDefaultHelper(ant);
};

const makeDefaultHelper = (ant: Types.AnnotationTypes) => {
  if (ant.type === "struct") {
    type Result = Record<string, unknown>;
    return Object.entries(ant.struct.params).reduce<Result>((prev, v) => {
      prev[v[0]] = makeDefaultHelper(v[1] as Types.AnnotationTypes);
      return prev;
    }, {});
  }
  return ant.default;
};
