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

export const createKindLine = (data: { kind: string }): KeyWord<"type"> => {
  return createKeywordLine(KEYWORD_TYPE, data.kind);
};
