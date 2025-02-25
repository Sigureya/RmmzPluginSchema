import type {
  AnnotationPrimitiveTypes,
  BaseStruct,
  StructArray,
  StructBase2,
  StructComplete,
  StructWithParams,
} from "./types/";

export const maxDepth = (
  obj: AnnotationPrimitiveTypes | StructWithParams
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
  annotation: AnnotationPrimitiveTypes | Omit<StructComplete, "default">
): Set<StructBase2> => {
  return traverseStruct(
    annotation,
    (s, acc) => {
      if (hasStruct(s) && !acc.has(s.struct)) {
        acc.add(s.struct);
      }
      return acc;
    },
    new Set<StructBase2>()
  );
};

export const traverseStruct = <
  Result,
  Ant extends AnnotationPrimitiveTypes | StructWithParams
>(
  obj: Ant,
  callback: (structName: Ant, acc: Result, depth: number) => Result,
  initialValue: Result
) => {
  const x = callback(obj, initialValue, 0);
  return traverseHelper(obj, callback, x);
};

const hasStruct = (
  ant: AnnotationPrimitiveTypes | BaseStruct<object> | StructArray<object[]>
) => {
  return ant.type === "struct" || ant.type === "struct[]";
};

const traverseHelper = <
  Result,
  Ant extends AnnotationPrimitiveTypes | StructWithParams
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
