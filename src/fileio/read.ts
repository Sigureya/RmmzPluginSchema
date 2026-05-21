import type {
  ParsedPlugin,
  PluginParamsRecord,
  ResultOfparsePluginParamRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginBodyHandler, PluginInfoHandler } from "./types/handlers";
import type {
  MessageOfparsePluginParamRecordEx,
  PluginReadResult,
} from "./types/msg";

export const readPluginInfosSafe = async (
  messages: MessageOfparsePluginParamRecordEx,
  handlers: PluginInfoHandler,
): Promise<ResultOfparsePluginParamRecord> => {
  try {
    const source = await handlers.readPluginInfos();
    return parsePluginInfosSafe(source, messages, handlers);
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
  handlers: PluginInfoHandler,
): ResultOfparsePluginParamRecord => {
  try {
    return handlers.parsePluginList(source, messages);
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
  handlers: PluginBodyHandler,
): Promise<PluginReadResult>[] => {
  return recordsResult.plugins.map((record): Promise<PluginReadResult> => {
    return readSinglePluginBody(record, messages, handlers);
  });
};

const readSinglePluginBody = async (
  record: PluginParamsRecord,
  messages: MessageOfparsePluginParamRecordEx,
  handlers: PluginBodyHandler,
): Promise<PluginReadResult> => {
  try {
    const source = await handlers.readPluginBody(record.name);
    return {
      record,
      plugin: parsePluginBodySafe(source, handlers),
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
  handlers: PluginBodyHandler,
): ParsedPlugin | null => {
  try {
    return handlers.parsePluginBody(source);
  } catch {
    return null;
  }
};
