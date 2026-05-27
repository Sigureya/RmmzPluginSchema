import type {
  CommandArgExtractors,
  CommandExtractorEntry,
  CommandMapKey,
} from "./core/extractor/types";
export { defaultCommandExtractHandlers } from "./core/command2";
export type { CommandExtractMessageHandlers } from "./core/extractor/types";
import type { CommandExtractorEntryList } from "./core/types";
import { jsonPathFromPluginSchema } from "./top";

export const mergeCommandMap = (
  list: ReadonlyArray<CommandExtractorEntryList>,
): Map<CommandMapKey, CommandArgExtractors> => {
  const src: CommandExtractorEntry[] = list.flatMap(
    (item) => item.extractorEntries,
  );
  return new Map(src);
};

/**
 * @deprecated Use `jsonPathFromPluginSchema` instead.
 */
export const convertPlugin = jsonPathFromPluginSchema;
