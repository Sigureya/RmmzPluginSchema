import type * as Primitve from "./types/primitive";

const ddd = <T>(data: T, key: string & keyof T) => {
  const value = data[key];
  return value === undefined ? "" : (`@${key} ${data[key]}` as const);
};

export const makeDefaultPrimitive = (annotation: { default: number }) => {
  return ddd(annotation, "default");
};

export const makeAnnotionEx = <T extends Primitve.AnnotationBase>(
  ant: T,
  key: ReadonlyArray<string & keyof T>
) => {
  return key.map((k) => ddd(ant, k)).filter((s) => s !== "");
};
export const baseAnnotion = (ant: Primitve.AnnotationBase) => {
  return makeAnnotionEx(ant, ["type", "text", "desc", "parent"]);
};
