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

export const typeAnnotation = (type: Pick<Primitve.AnnotationBase, "type">) => {
  return `@type ${type.type}` as const;
};

export const baseAnnotion = (ant: Omit<Primitve.AnnotationBase, "default">) => {
  return makeAnnotion(ant, ["text", "desc", "parent"]);
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

export const selectAnnotations = (
  select: OmitBaseParams<Primitve.Select<number | string>>
) => {
  return select.options.flatMap(
    (s) => [`@option ${s.option}`, `@value ${s.value}`] as const
  );
};
export const comboAnnotations = (
  combo: OmitBaseParams<Primitve.ComboAnnotation>
) => {
  return combo.options.map((s: string) => `@option ${s}` as const);
};

export const fileAnnotations = (
  file: OmitBaseParams<Primitve.FilePathAnnotation>
) => {
  return makeAnnotion(file, ["dir"]);
};
