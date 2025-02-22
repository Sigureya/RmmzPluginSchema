import type * as Primitve from "./types/primitive";
type OmitBaseParams<T> = Omit<T, keyof Primitve.AnnotationBase>;

const create = <T>(data: T, key: string & keyof T) => {
  const value = data[key];
  return value === undefined ? undefined : (`@${key} ${data[key]}` as const);
};

export const makeAnnotion = <T>(
  ant: T,
  key: ReadonlyArray<string & keyof typeof ant>
) => {
  return key.map((k) => create(ant, k)).filter((s) => s !== undefined);
};

export const baseAnnotion = (ant: Omit<Primitve.AnnotationBase, "default">) => {
  return makeAnnotion(ant, ["type", "text", "desc", "parent"]);
};

export const numberArgAnnotations = (
  num: OmitBaseParams<Primitve.NumberArg>
) => {
  return makeAnnotion(num, ["min", "max", "digit"]);
};

export const booleanArgAnnotations = (
  bool: OmitBaseParams<Primitve.BooleanArg>
) => {
  return makeAnnotion(bool, ["on", "off"]);
};

export const selectAnnotations = <T extends number | string>(
  select: OmitBaseParams<Primitve.Select<T>>
) => {
  return select.options.flatMap(
    (s) => [`@option ${s.option}`, `@value ${s.value}`] as const
  );
};
