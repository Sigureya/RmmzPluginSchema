import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ParsedPlugin,
  ResultOfparsePluginParamRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { MessageOfparsePluginParamRecordEx } from "./msg";

export interface PluginFileReadHandlers {
  readPluginInfos: () => Promise<string>;
  readPluginBody: (pluginName: string) => Promise<string>;
}

export interface PluginReadHandlers extends PluginFileReadHandlers {
  readPluginInfos: () => Promise<string>;
  readPluginBody: (pluginName: string) => Promise<string>;
  jsonPath: (path: string) => JSONPathReader;
  parsePluginBody: (src: string) => ParsedPlugin;
  parsePluginList: (
    source: string,
    msg: MessageOfparsePluginParamRecordEx,
  ) => ResultOfparsePluginParamRecord;
}
