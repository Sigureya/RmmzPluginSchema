import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginCommandData } from "@RmmzPluginSchema/rmmz/plugin";
import { parseDeepRecord } from "@RmmzPluginSchema/rmmz/plugin";
import { extractPluginCommandArgs } from "./command";
import type {
  CommandArgExtractors,
  CommandExtractError,
  CommandExtractMessageHandlers,
  CommandExtractResult,
  CommandMapKey,
} from "./extractor/types";
import { pluginComamndName } from "./schema";

export const defaultCommandExtractHandlers: CommandExtractMessageHandlers = {
  undefinedCommand: (command): CommandExtractError => ({
    message: `undefined command: ${command.parameters[0]}:${command.parameters[1]}`,
    source: "undefinedCommand",
  }),
  deepJSONParseError: (command, error): CommandExtractError => ({
    message: `parse failed: ${command.parameters[0]}:${command.parameters[1]}: ${String(error)}`,
    source: "deepJSONParseError",
  }),
  extractArgsError: (command, error): CommandExtractError => ({
    message: `extract args failed: ${command.parameters[0]}:${command.parameters[1]}: ${String(error)}`,
    source: "extractArgsError",
  }),
};

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
  const extractor = map.get(key);
  if (!extractor) {
    return makeEmptyCommandResult(command, handlers.undefinedCommand(command));
  }
  try {
    const parsed = parseFn(command.parameters[3]);
    return ee7(parsed, extractor, command, handlers);
  } catch (error) {
    return makeEmptyCommandResult(
      command,
      handlers.deepJSONParseError(command, error),
    );
  }
};

const ee7 = (
  value: Record<string, JSONValue>,
  extractor: CommandArgExtractors,
  command: PluginCommandData,
  handlers: CommandExtractMessageHandlers,
) => {
  try {
    return extractPluginCommandArgs(value, extractor);
  } catch (e) {
    return makeEmptyCommandResult(
      command,
      handlers.extractArgsError(command, e),
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
