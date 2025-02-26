import type {
  AnnotationPrimitiveTypes,
  StructAnnotationBase_Partial,
  StructAnnotationBase_Array,
  StructBase,
  StructAnnotationBase_WithParams,
  StructAnnotationBase_WithType,
} from "./types/";

export const maxDepth = (
  obj: AnnotationPrimitiveTypes | StructAnnotationBase_WithParams
): number => {
  return traverseStruct(
    obj,
    (s, acc) => {
      return hasStruct(s) ? acc + 1 : acc;
    },
    0
  );
};

export const flatStructs = (
  annotation: AnnotationPrimitiveTypes | StructAnnotationBase_WithType
): Set<StructBase> => {
  return traverseStruct(
    annotation,
    (s, acc) => {
      if (hasStruct(s) && !acc.has(s.struct)) {
        acc.add(s.struct);
      }
      return acc;
    },
    new Set<StructBase>()
  );
};

export const traverseStruct = <
  Result,
  Ant extends AnnotationPrimitiveTypes | StructAnnotationBase_WithParams
>(
  obj: Ant,
  callback: (structName: Ant, acc: Result, depth: number) => Result,
  initialValue: Result
) => {
  const x = callback(obj, initialValue, 0);
  return traverseHelper(obj, callback, x);
};

const hasStruct = (
  ant:
    | AnnotationPrimitiveTypes
    | StructAnnotationBase_Partial
    | StructAnnotationBase_Array
) => {
  return ant.type === "struct" || ant.type === "struct[]";
};

const traverseHelper = <
  Result,
  Ant extends AnnotationPrimitiveTypes | StructAnnotationBase_WithParams
>(
  annotation: Ant,
  fn: (annotation: Ant, value: Result, depth: number) => Result,
  result: Result,
  depth: number = 0
): Result => {
  if (depth > 32) {
    throw new Error("Max depth exceeded");
  }
  if (!hasStruct(annotation)) {
    return result;
  }
  // if (annotation.struct === undefined) {
  //   return result;
  // }
  let acc: Result = result;
  //  Object.entries<Ant>(annotation.struct.params);

  for (const p in annotation.struct.params) {
    const param: Ant = (annotation.struct.params as Record<string, Ant>)[p];
    const ac2 = fn(param, acc, depth);
    acc = traverseHelper(param, fn, ac2, depth + 1);
  }
  return acc;
};
