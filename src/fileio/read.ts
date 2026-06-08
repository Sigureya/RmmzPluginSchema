import type {
  ParsedPlugin,
  PluginParamsRecord,
  ResultOfparsePluginParamRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import { parsePluginParamRecord } from "@RmmzPluginSchema/rmmz/plugin";
import type {
  MessageOfparsePluginParamRecordEx,
  PluginReadResult,
} from "./types/msg";

export const readPluginInfosSafe = async (
  messages: MessageOfparsePluginParamRecordEx,
  readPluginInfos: () => Promise<string>,
  parsePluginList: (
    source: string,
    msg: MessageOfparsePluginParamRecordEx,
  ) => ResultOfparsePluginParamRecord = parsePluginParamRecord,
): Promise<ResultOfparsePluginParamRecord> => {
  try {
    const source = await readPluginInfos();
    return parsePluginInfosSafe(source, messages, parsePluginList);
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
  parsePluginList: (
    source: string,
    msg: MessageOfparsePluginParamRecordEx,
  ) => ResultOfparsePluginParamRecord,
): ResultOfparsePluginParamRecord => {
  try {
    return parsePluginList(source, messages);
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
  parsePluginBody: (src: string) => ParsedPlugin,
): Promise<PluginReadResult>[] => {
  return recordsResult.plugins.map((record): Promise<PluginReadResult> => {
    return readSinglePluginBody(
      record,
      messages,
      readPluginBody,
      parsePluginBody,
    );
  });
};

const readSinglePluginBody = async (
  record: PluginParamsRecord,
  messages: MessageOfparsePluginParamRecordEx,
  readPluginBody: (pluginName: string) => Promise<string>,
  fn: (src: string) => ParsedPlugin,
): Promise<PluginReadResult> => {
  try {
    const source = await readPluginBody(record.name);
    return {
      record,
      plugin: parsePluginBodySafe(source, fn),
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

const parsePluginBodySafe = (
  source: string,
  fn: (src: string) => ParsedPlugin,
): ParsedPlugin | null => {
  try {
    return fn(source);
  } catch {
    return null;
  }
};
