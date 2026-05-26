import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginScalarParam,
  PluginArrayParamType,
  PluginParamsRecord,
  PluginCommandData,
} from "@RmmzPluginSchema/rmmz/plugin";
import { parseDeepRecord } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginSchemaOf } from "@RmmzPluginSchema/rmmz/plugin/core/pluginJSON2type";
import { extractPluginCommandArgs } from "./core";
import type {
  CommandArgExtractors,
  CommandExtractorEntry,
  CommandExtractResult,
  CommandMapKey,
} from "./core/extractor/types";
import { extractPluginParamFromRecord } from "./core/param";
import { createPluginValueExtractor, pluginComamndName } from "./core/schema";
import type {
  CommandExtractorEntryList,
  PluginExtractorBundle,
  ConvertPluginResultEx,
} from "./core/types";

export const extractArgsFromPluiginCommand = (
  command: PluginCommandData,
  map: ReadonlyMap<CommandMapKey, CommandArgExtractors>,
  parseFn = parseDeepRecord,
): CommandExtractResult | undefined => {
  const key: CommandMapKey = pluginComamndName(
    command.parameters[0],
    command.parameters[1],
  );
  const extractor = map.get(key);
  if (!extractor) {
    return undefined;
  }
  const args = parseFn(command.parameters[3]);
  return extractPluginCommandArgs(args, extractor);
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
