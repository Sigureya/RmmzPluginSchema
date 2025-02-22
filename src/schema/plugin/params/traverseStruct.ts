import type { AnnotationTypes, StructBase } from "./types/";

export const maxDepth = (obj: AnnotationTypes): number => {
  return traverseStruct(
    obj,
    (s, acc) => {
      return hasStruct(s) ? acc + 1 : acc;
    },
    0
  );
};

export const flatStruct = (annotation: AnnotationTypes): Set<StructBase> => {
  return traverseStruct(
    annotation,
    (s, acc) => {
      if (hasStruct(s) && !acc.has(s.struct)) {
        acc.add(s.struct);
      }
      return acc;
    },
    new Set()
  );
};

export const traverseStruct = <Result>(
  obj: AnnotationTypes,
  callback: (structName: AnnotationTypes, acc: Result, depth: number) => Result,
  initialValue: Result
) => {
  const x = callback(obj, initialValue, 0);
  return traverseHelper(obj, callback, x);
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
