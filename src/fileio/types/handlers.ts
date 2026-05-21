import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ParsedPlugin,
  ResultOfparsePluginParamRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { MessageOfparsePluginParamRecordEx } from "./msg";

export interface PluginInfoHandler {
  readPluginInfos: () => Promise<string>;
  parsePluginList: (
    source: string,
    msg: MessageOfparsePluginParamRecordEx,
  ) => ResultOfparsePluginParamRecord;
}

export interface PluginBodyHandler {
  readPluginBody: (pluginName: string) => Promise<string>;
  parsePluginBody: (src: string) => ParsedPlugin;
}

export interface PluginReadHandlers {
  readPluginInfos: () => Promise<string>;
  readPluginBody: (pluginName: string) => Promise<string>;
  jsonPath: (path: string) => JSONPathReader;
  parsePluginBody: (src: string) => ParsedPlugin;
  parsePluginList: (
    source: string,
    msg: MessageOfparsePluginParamRecordEx,
  ) => ResultOfparsePluginParamRecord;
}
