import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  DeepJSONParserHandlers,
  ParsedPlugin,
  PluginParamsRecord,
  ResultOfparsePluginParamRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  compilePluginAsArraySchema,
  parsePluginByLocale,
  parsePluginParamRecord2,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ConvertPluginResult } from "../features";
import { jsonPathFromPluginSchema } from "../features";
import type { MessageOfparsePluginParamRecordEx } from "./types/msg";

interface PluginReadResult {
  plugin: ParsedPlugin | null;
  error: string;
  record: PluginParamsRecord;
}

export interface PluginReadHandlers {
  readPluginInfos: () => Promise<string>;
  readPluginBody: (pluginName: string) => Promise<string>;
  jsonPath: (path: string) => JSONPathReader;
}

export const READ_PLUGIN_MESSAGES: MessageOfparsePluginParamRecordEx = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully",
};

export const readPluginsWithSchema = async (
  messages: MessageOfparsePluginParamRecordEx,
  handlers: PluginReadHandlers,
  parserHandlers: DeepJSONParserHandlers,
): Promise<ConvertPluginResult[]> => {
  const pluginRecordsResult = await readPluginInfosSafe(
    messages,
    handlers.readPluginInfos,
  );
  const pluginBodyReads = readAllPluginBodies(
    pluginRecordsResult,
    messages,
    handlers.readPluginBody,
  );
  return await convertAllPluginReads(pluginBodyReads, handlers, parserHandlers);
};

const readPluginInfosSafe = async (
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

const convertPluginReadResult = (
  readResult: PluginReadResult,
  pluginHandlers: PluginReadHandlers,
  parserHandlers: DeepJSONParserHandlers,
): null | ConvertPluginResult => {
  if (readResult.plugin === null) {
    return null;
  }

  const schema = compilePluginAsArraySchema(readResult.plugin, parserHandlers);
  return jsonPathFromPluginSchema(
    {
      pluginName: readResult.record.name,
      schema: schema,
    },
    readResult.record,
    (path: string) => pluginHandlers.jsonPath(path),
  );
};

const convertAllPluginReads = async (
  readTasks: readonly Promise<PluginReadResult>[],
  pluginHandlers: PluginReadHandlers,
  parserHandlers: DeepJSONParserHandlers,
): Promise<ConvertPluginResult[]> => {
  const convertedOrNull = await Promise.all(
    readTasks.map(async (readTask) => {
      return convertPluginReadResult(
        await readTask,
        pluginHandlers,
        parserHandlers,
      );
    }),
  );
  return convertedOrNull.filter((result) => result !== null);
};

const readAllPluginBodies = (
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
