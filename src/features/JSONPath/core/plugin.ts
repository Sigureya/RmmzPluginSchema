import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginScalarParam,
  PluginArrayParamType,
  PluginParamsRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginSchemaOf } from "@RmmzPluginSchema/rmmz/plugin/core/pluginJSON2type";
import type {
  CommandArgExtractors,
  CommandExtractorEntry,
  CommandMapKey,
} from "./extractor/types";
import { extractPluginParamFromRecord } from "./param";
import { createPluginValueExtractor } from "./schema";
import type {
  CommandExtractorEntryList,
  PluginExtractorBundle,
  ConvertPluginResult,
} from "./types";

export const mergeCommandMap = (
  list: ReadonlyArray<CommandExtractorEntryList>
): Map<CommandMapKey, CommandArgExtractors> => {
  const src: CommandExtractorEntry[] = list.flatMap(
    (item) => item.extractorEntries
  );
  return new Map(src);
};

export const convertPlugin = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  schema: PluginSchemaOf<S, A>,
  record: PluginParamsRecord,
  factoryFn: (path: string) => JSONPathReader
): ConvertPluginResult<S, A> => {
  const extractor: PluginExtractorBundle = createPluginValueExtractor(
    schema.pluginName,
    schema.schema,
    factoryFn
  );
  const { params } = extractPluginParamFromRecord(record, extractor.params);
  return {
    record: record,
    schema,
    extractorEntries: extractor.commands,
    params: params,
  };
};
