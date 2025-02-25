import type * as Primitve from "./types/";
import type { Dictionary, OmitBaseParams } from "./types/";

const EMPTY_DICTINARY: Dictionary = {} as const;

const simpleAnntation = <
  V extends string | number,
  T extends { [K in string]?: V } = { [K in string]?: V }
>(
  data: T,
  key: string & keyof typeof data
): `@${typeof key} ${V}` | undefined => {
  const value: V | undefined = data[key];
  return value === undefined ? undefined : (`@${key} ${value}` as const);
};

export const collectAnnotations = <
  V extends string | number,
  T extends { [K in string]?: V }
>(
  ant: T,
  key: ReadonlyArray<string & keyof typeof ant>
) => {
  return key.map((k) => simpleAnntation(ant, k)).filter((s) => s !== undefined);
};

export const lookupDictionary = (key: string, dic: Dictionary): string => {
  const value = dic[key];
  return value === undefined ? key : value;
};

export const booleanAnnotations = (
  bool: OmitBaseParams<Primitve.BooleanArg>,
  dic: Dictionary = EMPTY_DICTINARY
): `@${"on" | "off"} ${string}`[] => {
  return [
    formatTextAnnotation(bool, "on", dic),
    formatTextAnnotation(bool, "off", dic),
  ].filter((s) => s !== undefined);
};

export const formatTextAnnotation = <
  K extends "on" | "off" | "desc" | "text",
  T extends { [key in K]?: string }
>(
  bool: T,
  key: K,
  dic: Dictionary = EMPTY_DICTINARY
): `@${K} ${string}` | undefined => {
  const value: string | undefined = bool[key];
  return value
    ? (`@${key} ${lookupDictionary(value, dic)}` as const)
    : undefined;
};

export const typeAnnotation = (type: Pick<Primitve.AnnotationBase, "type">) => {
  return `@type ${type.type}` as const;
};

export const baseAnnotions = (
  ant: Pick<Primitve.AnnotationBase, "text" | "desc" | "parent">,
  dic: Dictionary = EMPTY_DICTINARY
) => {
  return (
    [
      formatTextAnnotation(ant, "text", dic),
      formatTextAnnotation(ant, "desc", dic),
      simpleAnntation<string, typeof ant>(ant, "parent"),
    ] as const
  ).filter((s) => s !== undefined);
};

export const numberAnnotations = (num: OmitBaseParams<Primitve.NumberArg>) => {
  return collectAnnotations(num, ["min", "max", "digit"]);
};

export const selectAnnotations = (
  select: OmitBaseParams<Primitve.Select<number | string>>,
  dic: Dictionary = EMPTY_DICTINARY
) => {
  return select.options.flatMap(
    (s) =>
      [
        `@option ${lookupDictionary(s.option, dic)}`,
        `@value ${s.value}`,
      ] as const
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
  return collectAnnotations(file, ["dir"]);
};
