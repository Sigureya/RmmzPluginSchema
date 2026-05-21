import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { MessageOfparsePluginParamRecord } from "@RmmzPluginSchema/rmmz/plugin";

export interface MessageOfparsePluginParamRecordEx extends MessageOfparsePluginParamRecord {
  readErrorPluginsJS: string;
  readErrorPluginBody: string;
}

export interface PluginReadHandlers {
  readPluginInfos: () => Promise<string>;
  readPluginBody: (pluginName: string) => Promise<string>;
  jsonPath: (path: string) => JSONPathReader;
}
