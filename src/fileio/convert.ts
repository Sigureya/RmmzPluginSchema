import type { DeepJSONParserHandlers } from "@RmmzPluginSchema/rmmz/plugin";
import { compilePluginAsArraySchema } from "@RmmzPluginSchema/rmmz/plugin";
import type {
  CommandMapKey,
  CommandArgExtractors,
  ConvertPluginResult,
} from "../features";
import { mergeCommandMap, jsonPathFromPluginSchema } from "../features";
import { readAllPluginBodies, readPluginInfosSafe } from "./read";
import type { PluginReadHandlers } from "./types/handlers";
import type {
  MessageOfparsePluginParamRecordEx,
  PluginReadResult,
} from "./types/msg";

export const READ_PLUGIN_MESSAGES: MessageOfparsePluginParamRecordEx = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully",
};

export const buildCommandMapFromFiles = async (
  messages: MessageOfparsePluginParamRecordEx,
  handlers: PluginReadHandlers,
  parserHandlers: DeepJSONParserHandlers,
): Promise<Map<CommandMapKey, CommandArgExtractors>> => {
  const list = await readPluginsWithSchema(messages, handlers, parserHandlers);
  return mergeCommandMap(list);
};

export const readPluginsWithSchema = async (
  messages: MessageOfparsePluginParamRecordEx,
  handlers: PluginReadHandlers,
  parserHandlers: DeepJSONParserHandlers,
): Promise<ConvertPluginResult[]> => {
  const pluginRecordsResult = await readPluginInfosSafe(
    messages,
    () => handlers.readPluginInfos(),
    (source, msg) => handlers.parsePluginList(source, msg),
  );
  const pluginBodyReads = readAllPluginBodies(
    pluginRecordsResult,
    messages,
    (pluginName) => handlers.readPluginBody(pluginName),
    (src) => handlers.parsePluginBody(src),
  );
  return await convertAllPluginReads(pluginBodyReads, handlers, parserHandlers);
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
