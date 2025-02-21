import type {
  AnnotationTypes,
  HasStruct,
  StructBase,
  Type_Struct,
} from "./structBase";

const hasStruct = (ant: AnnotationTypes) => {
  return ant.type === "struct" || ant.type === "struct[]";
};

const traverseHelper = <Result>(
  annotation: AnnotationTypes,
  fn: (annotation: AnnotationTypes, value: Result, depth: number) => Result,
  result: Result,
  depth: number = 0
): Result => {
  if (!hasStruct(annotation)) {
    return result;
  }
  let acc: Result = result;
  for (const p in annotation.struct.params) {
    const param: AnnotationTypes = annotation.struct.params[p];
    const ac2 = fn(param, acc, depth);
    acc = traverseHelper(param, fn, ac2, depth + 1);
  }
  return acc;
};

export const traverseStruct = <Result>(
  obj: AnnotationTypes,
  callback: (structName: AnnotationTypes, acc: Result, depth: number) => Result,
  initialValue: Result
) => {
  return traverseHelper(obj, callback, initialValue);
};

export const maxDepth = (obj: AnnotationTypes): number => {
  return hasStruct(obj)
    ? traverseStruct(
        obj,
        (s, acc) => {
          return Math.max(acc, hasStruct(s) ? 1 : 0);
        },
        1
      )
    : 0;
};
