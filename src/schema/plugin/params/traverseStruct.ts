import type { AnnotationTypes } from "./types/";

export const maxDepth = (obj: AnnotationTypes): number => {
  return hasStruct(obj)
    ? traverseStruct(
        obj,
        (s, acc) => {
          return hasStruct(s) ? acc + 1 : acc;
        },
        1
      )
    : 0;
};

export const traverseStruct = <Result>(
  obj: AnnotationTypes,
  callback: (structName: AnnotationTypes, acc: Result, depth: number) => Result,
  initialValue: Result
) => {
  return traverseHelper(obj, callback, initialValue);
};

const hasStruct = (ant: AnnotationTypes) => {
  return ant.type === "struct" || ant.type === "struct[]";
};

const traverseHelper = <Result>(
  annotation: AnnotationTypes,
  fn: (annotation: AnnotationTypes, value: Result, depth: number) => Result,
  result: Result,
  depth: number = 0
): Result => {
  if (depth > 32) {
    throw new Error("Max depth exceeded");
  }
  if (!hasStruct(annotation)) {
    return fn(annotation, result, depth);
  }
  let acc: Result = result;
  for (const p in annotation.struct.params) {
    const param: AnnotationTypes = (
      annotation.struct.params as Record<string, AnnotationTypes>
    )[p];
    const ac2 = fn(param, acc, depth);
    acc = traverseHelper(param, fn, ac2, depth + 1);
  }
  return acc;
};
