import type * as Primitve from "./types/primitive";
import type { Dictionary, OmitBaseParams } from "./types/";

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
const LIST = ["on", "off", "desc", "text"] as const;

export const dicEX = (key: string, dic: Dictionary): string => {
  const value = dic[key];
  return value === undefined ? key : value;
};

export const booleanArgAnnotations = (
  bool: OmitBaseParams<Primitve.BooleanArg>,
  dic: Dictionary = {}
): `@${"on" | "off"} ${string}`[] => {
  return [
    formatBooleanAnnotation(bool, "on", dic),
    formatBooleanAnnotation(bool, "off", dic),
  ].filter((s) => s !== undefined);
};

export const formatBooleanAnnotation = <K extends "on" | "off">(
  bool: OmitBaseParams<Primitve.BooleanArg>,
  key: K,
  dic: Dictionary = {}
): `@${K} ${string}` | undefined => {
  const value = bool[key];
  return value ? (`@${key} ${dicEX(value, dic)}` as const) : undefined;
};
export const typeAnnotation = (type: Pick<Primitve.AnnotationBase, "type">) => {
  return `@type ${type.type}` as const;
};

export const baseAnnotion = (
  ant: Omit<Primitve.AnnotationBase, "default">,
  dic: Dictionary = {}
) => {
  return makeAnnotion(ant, ["text", "desc", "parent"]);
};

export const numberArgAnnotations = (
  num: OmitBaseParams<Primitve.NumberArg>
) => {
  return makeAnnotion(num, ["min", "max", "digit"]);
};

export const selectAnnotations = (
  select: OmitBaseParams<Primitve.Select<number | string>>,
  dic: Dictionary = {}
) => {
  return select.options.flatMap(
    (s) => [`@option ${dicEX(s.option, dic)}`, `@value ${s.value}`] as const
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
