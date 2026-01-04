import type { PrimitiveParam } from "@RmmzPluginSchema/rmmz/plugin";
import { KEYWORD_TYPE } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import type { KeyWord } from "./types";

export const createKeywordLine = <K extends string>(
  keyword: K,
  value: string
): KeyWord<K> => {
  return `@${keyword} ${value}`;
};

export const createKeywordLineEx = <T>(
  data: T,
  key: Extract<keyof T, string>
): KeyWord<Extract<typeof key, string>> | undefined => {
  const value = data[key];
  return value === undefined
    ? undefined
    : createKeywordLine(key, String(value));
};

export const createKindLine = (data: PrimitiveParam): KeyWord<"type"> => {
  if (data.kind === "struct") {
    return createKeywordLine(KEYWORD_TYPE, `struct<${data.struct}>`);
  }
  if (data.kind === "struct[]") {
    return createKeywordLine(KEYWORD_TYPE, `struct<${data.struct}>[]`);
  }
  return createKeywordLine(KEYWORD_TYPE, data.kind);
};
