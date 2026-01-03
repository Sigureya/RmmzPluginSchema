import type {
  LocalizedBlock,
  PluginBodyBlock,
  PluginStructBlock,
} from "./types";

interface StructsGroup {
  unlocale: PluginStructBlock[];
  localeMap: Record<string, PluginStructBlock[]>;
}

export const localizeBlocks = (
  bodies: ReadonlyArray<PluginBodyBlock>,
  structs: ReadonlyArray<PluginStructBlock>
): LocalizedBlock[] => {
  const group = groupStructsByLocale(structs);
  return bodies.map(
    (b): LocalizedBlock => ({
      body: b,
      structs: findStructsForBody(b, group),
    })
  );
};

const findStructsForBody = (
  body: PluginBodyBlock,
  ll: StructsGroup
): PluginStructBlock[] => {
  if (body.locale === undefined) {
    return ll.unlocale;
  }
  const list = ll.localeMap[body.locale];
  if (list) {
    return list;
  }
  return [];
};

const groupStructsByLocale = (
  structs: ReadonlyArray<PluginStructBlock>
): StructsGroup => {
  return structs.reduce<StructsGroup>(
    (acc, s) => {
      if (s.locale === undefined) {
        acc.unlocale.push(s);
        return acc;
      }

      if (!acc.localeMap[s.locale]) {
        acc.localeMap[s.locale] = [];
      }
      acc.localeMap[s.locale].push(s);
      return acc;
    },
    {
      unlocale: [],
      localeMap: {},
    }
  );
};
