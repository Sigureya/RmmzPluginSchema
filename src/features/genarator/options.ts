import type { ComboParam, SelectParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { OptionItem } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import {
  KEYWORD_OPTION,
  KEYWORD_VALUE,
} from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import { createKeywordLine } from "./keywordLine";
import type { KeyWord } from "./types";

export const generateSelectOptions = (
  select: SelectParam
): (KeyWord<typeof KEYWORD_OPTION> | KeyWord<typeof KEYWORD_VALUE>)[] => {
  return select.options.flatMap((opt: OptionItem) => [
    createKeywordLine(KEYWORD_OPTION, opt.option),
    createKeywordLine(KEYWORD_VALUE, opt.value),
  ]);
};

export const generateComboOptions = (
  combo: ComboParam
): KeyWord<typeof KEYWORD_OPTION>[] => {
  return combo.options.map((opt: string) =>
    createKeywordLine(KEYWORD_OPTION, opt)
  );
};
