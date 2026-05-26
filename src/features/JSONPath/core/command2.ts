import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginCommandData } from "@RmmzPluginSchema/rmmz/plugin";
import { parseDeepRecord } from "@RmmzPluginSchema/rmmz/plugin";
import { extractPluginCommandArgs } from "./command";
import type {
  CommandArgExtractors,
  CommandExtractMessageHandlers,
  CommandExtractResult,
  CommandMapKey,
} from "./extractor/types";
import { pluginComamndName } from "./schema";

export const extractArgsFromPluginCommandHandled = (
  command: PluginCommandData,
  map: ReadonlyMap<CommandMapKey, CommandArgExtractors>,
  handlers: CommandExtractMessageHandlers,
  parseFn: (
    record: Record<string, string>,
  ) => Record<string, JSONValue> = parseDeepRecord,
): CommandExtractResult => {
  const key: CommandMapKey = pluginComamndName(
    command.parameters[0],
    command.parameters[1],
  );
  try {
    const parsed = parseFn(command.parameters[3]);
    return extractCommandArgsByKeyHandled(parsed, key, command, map, handlers);
  } catch (error) {
    return makeEmptyCommandResult(
      command,
      handlers.deepJSONParseError(command, error),
    );
  }
};

const makeEmptyCommandResult = (
  command: PluginCommandData,
  error: NonNullable<CommandExtractResult["error"]>,
): CommandExtractResult => {
  return {
    pluginName: command.parameters[0],
    commandName: command.parameters[1],
    args: [],
    error,
  };
};

const extractCommandArgsByKeyHandled = (
  value: Record<string, JSONValue>,
  key: CommandMapKey,
  command: PluginCommandData,
  map: ReadonlyMap<CommandMapKey, CommandArgExtractors>,
  handlers: CommandExtractMessageHandlers,
): CommandExtractResult => {
  const extractor = map.get(key);
  if (!extractor) {
    return makeEmptyCommandResult(command, handlers.undefinedCommand(command));
  }
  return extractPluginCommandArgs(value, extractor);
};
