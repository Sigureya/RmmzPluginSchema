import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginScalarParam,
  PluginArrayParamType,
  PluginParamsRecord,
  PluginCommandData,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginSchemaOf } from "@RmmzPluginSchema/rmmz/plugin/core/pluginJSON2type";
import {
  extractArgsFromPluginCommandHandled,
  defaultCommandExtractHandlers,
} from "./core/command2";
import type {
  CommandArgExtractors,
  CommandExtractorEntry,
  CommandExtractMessageHandlers,
  CommandExtractResult,
  CommandMapKey,
} from "./core/extractor/types";
export { defaultCommandExtractHandlers } from "./core/command2";
export type { CommandExtractMessageHandlers } from "./core/extractor/types";
import { extractPluginParamFromRecord } from "./core/param";
import { createPluginValueExtractor } from "./core/schema";
import type {
  CommandExtractorEntryList,
  PluginExtractorBundle,
  ConvertPluginResultEx,
} from "./core/types";

export const extractArgsFromPluiginCommand = (
  command: PluginCommandData,
  map: ReadonlyMap<CommandMapKey, CommandArgExtractors>,
  handlers: CommandExtractMessageHandlers = defaultCommandExtractHandlers,
): CommandExtractResult => {
  return extractArgsFromPluginCommandHandled(command, map, handlers);
};

export const mergeCommandMap = (
  list: ReadonlyArray<CommandExtractorEntryList>,
): Map<CommandMapKey, CommandArgExtractors> => {
  const src: CommandExtractorEntry[] = list.flatMap(
    (item) => item.extractorEntries,
  );
  return new Map(src);
};

export const jsonPathFromPluginSchema = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
>(
  schema: PluginSchemaOf<S, A>,
  record: PluginParamsRecord,
  factoryFn: (path: string) => JSONPathReader,
): ConvertPluginResultEx<S, A> => {
  const extractor: PluginExtractorBundle = createPluginValueExtractor(
    schema.pluginName,
    schema.schema,
    factoryFn,
  );
  const { params } = extractPluginParamFromRecord(record, extractor.params);
  return {
    record: record,
    schema,
    extractorEntries: extractor.commands,
    params: params,
  };
};

/**
 * @deprecated Use `jsonPathFromPluginSchema` instead.
 */
export const convertPlugin = jsonPathFromPluginSchema;
