import type { PluginBodyBlock, PluginStructBlock } from "./types";

export const findPluginBodyByLocale = (
  bodies: ReadonlyArray<PluginBodyBlock>,
  locale: string
): PluginBodyBlock | undefined => {
  return bodies.reduce<PluginBodyBlock | undefined>((acc, item) => {
    if (item.locale === locale) {
      return item;
    }
    if (item.locale === undefined) {
      if (acc === undefined) {
        return item;
      }
    }
    return acc;
  }, undefined);
};

export const filterSturctByLocale = (
  structs: ReadonlyArray<PluginStructBlock>,
  locale: string
): PluginStructBlock[] => {
  const map = createDictionary(structs, locale);
  return structs.filter((s) => {
    if (s.locale === undefined) {
      if (map.has(s.struct)) {
        return !map.has(`${s.struct}!`);
      }
    }
    if (s.locale === locale) {
      return map.has(`${s.struct}!`);
    }
    return false;
  });
};

const createDictionary = (
  structs: ReadonlyArray<PluginStructBlock>,
  locale: string
): Set<string> => {
  const maped = structs.map((s): string => {
    if (s.locale === undefined) {
      return s.struct;
    }
    if (s.locale === locale) {
      return `${s.struct}!`;
    }
    return "";
  });
  return new Set(maped);
};
