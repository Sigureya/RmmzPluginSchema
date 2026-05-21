import type {
  MessageOfparsePluginParamRecord,
  ParsedPlugin,
  PluginParamsRecord,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface MessageOfparsePluginParamRecordEx extends MessageOfparsePluginParamRecord {
  readErrorPluginsJS: string;
  readErrorPluginBody: string;
}

export interface PluginReadResult {
  plugin: ParsedPlugin | null;
  error: string;
  record: PluginParamsRecord;
}
