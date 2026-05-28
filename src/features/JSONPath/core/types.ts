import type {
  PluginScalarParam,
  PluginArrayParamType,
  PluginParam,
  PluginParamsRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginSchemaOf } from "@RmmzPluginSchema/rmmz/plugin/core/pluginJSON2type";
import type {
  CommandExtractorEntry,
  PluginExtractedValue,
  PluginValuesExtractorBundle,
} from "./extractor/types";

/**
 * @deprecated pipelines 起点の現行フローでは未使用です。
 */
export interface PluginExtractorBundle {
  pluginName: string;
  params: PluginValuesExtractorBundle[];
  commands: CommandExtractorEntry[];
}

/**
 * @deprecated pipelines 起点の現行フローでは未使用です。
 */
export interface CommandExtractorEntryList {
  extractorEntries: CommandExtractorEntry[];
}

/**
 * @deprecated pipelines 起点の現行フローでは未使用です。
 */
export interface ConvertPluginResult {
  params: PluginExtractedValue<PluginParam>[];
  record: PluginParamsRecord;
  schema: PluginSchemaOf<PluginScalarParam, PluginArrayParamType>;
  extractorEntries: CommandExtractorEntry[];
}

/**
 * @deprecated pipelines 起点の現行フローでは未使用です。
 */
export interface ConvertPluginResultEx<
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
> extends ConvertPluginResult {
  params: PluginExtractedValue<PluginParam>[];
  record: PluginParamsRecord;
  schema: PluginSchemaOf<S, A>;
  extractorEntries: CommandExtractorEntry[];
}
