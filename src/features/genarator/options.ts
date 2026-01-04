import type { ComboParam, SelectParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { OptionItem } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import { KEYWORD_OPTION } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import { createKeywordLine } from "./keywordLine";
import type { KeyWord } from "./types";

export const generateSelectOptions = (
  select: SelectParam
): (KeyWord<"option"> | KeyWord<"value">)[] => {
  return select.options.flatMap((opt: OptionItem) => [
    createKeywordLine(KEYWORD_OPTION, opt.option),
    createKeywordLine("value", opt.value),
  ]);
};

export const generateComboOptions = (
  combo: ComboParam
): KeyWord<"option">[] => {
  return combo.options.map((opt: string) =>
    createKeywordLine(KEYWORD_OPTION, opt)
  );
};
