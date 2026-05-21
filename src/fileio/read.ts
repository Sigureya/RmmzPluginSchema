import type {
  ParsedPlugin,
  PluginParamsRecord,
  ResultOfparsePluginParamRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  parsePluginByLocale,
  parsePluginParamRecord2,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginReadResult } from "./convert";
import type { MessageOfparsePluginParamRecordEx } from "./types/msg";

export const readPluginInfosSafe = async (
  messages: MessageOfparsePluginParamRecordEx,
  readPluginInfos: () => Promise<string>,
): Promise<ResultOfparsePluginParamRecord> => {
  try {
    const source = await readPluginInfos();
    return parsePluginInfosSafe(source, messages);
  } catch {
    return {
      message: messages.readErrorPluginsJS,
      plugins: [],
      invalidPlugins: 0,
      complete: false,
    };
  }
};

const parsePluginInfosSafe = (
  source: string,
  messages: MessageOfparsePluginParamRecordEx,
): ResultOfparsePluginParamRecord => {
  try {
    return parsePluginParamRecord2(source, messages);
  } catch {
    return {
      message: messages.readErrorPluginsJS,
      plugins: [],
      invalidPlugins: 0,
      complete: false,
    };
  }
};

export const readAllPluginBodies = (
  recordsResult: ResultOfparsePluginParamRecord,
  messages: MessageOfparsePluginParamRecordEx,
  readPluginBody: (pluginName: string) => Promise<string>,
): Promise<PluginReadResult>[] => {
  return recordsResult.plugins.map((record): Promise<PluginReadResult> => {
    return readSinglePluginBody(record, messages, readPluginBody);
  });
};

const readSinglePluginBody = async (
  record: PluginParamsRecord,
  messages: MessageOfparsePluginParamRecordEx,
  readPluginBody: (pluginName: string) => Promise<string>,
): Promise<PluginReadResult> => {
  try {
    const source = await readPluginBody(record.name);
    return {
      record,
      plugin: parsePluginBodySafe(source),
      error: "",
    };
  } catch {
    return {
      record,
      plugin: null,
      error: messages.readErrorPluginBody,
    };
  }
};

const parsePluginBodySafe = (source: string): ParsedPlugin | null => {
  try {
    return parsePluginByLocale(source);
  } catch {
    return null;
  }
};
