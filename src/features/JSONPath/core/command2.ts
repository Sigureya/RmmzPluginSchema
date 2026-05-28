import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginCommandData } from "@RmmzPluginSchema/rmmz/plugin";
import { parseDeepRecord } from "@RmmzPluginSchema/rmmz/plugin";
import { extractPluginCommandArgs } from "./command";
import type {
  CommandArgExtractors,
  PluginCommandExtractContext,
  PluginCommandExtractErrorHandlers,
  CommandExtractResult,
  CommandMapKey,
} from "./extractor/types";
import { pluginComamndName } from "./schema";

export const extractArgsFromPluginCommand = (
  command: PluginCommandData,
  map: ReadonlyMap<CommandMapKey, CommandArgExtractors>,
  handlers: PluginCommandExtractErrorHandlers,
  parseFn: (
    record: Record<string, string>,
  ) => Record<string, JSONValue> = parseDeepRecord,
): CommandExtractResult => {
  const context: PluginCommandExtractContext = {
    command,
    pluginName: command.parameters[0],
    commandName: command.parameters[1],
  };
  const key: CommandMapKey = pluginComamndName(
    command.parameters[0],
    command.parameters[1],
  );
  const extractor = map.get(key);
  if (!extractor) {
    return makeEmptyCommandResult(
      command,
      handlers.commandNotFoundError(context),
    );
  }
  try {
    const parsed = parseFn(command.parameters[3]);
    return ee7(parsed, extractor, context, handlers);
  } catch (error) {
    return makeEmptyCommandResult(
      command,
      handlers.commandParseError(context, error),
    );
  }
};

const ee7 = (
  value: Record<string, JSONValue>,
  extractor: CommandArgExtractors,
  context: PluginCommandExtractContext,
  handlers: PluginCommandExtractErrorHandlers,
) => {
  try {
    return extractPluginCommandArgs(value, extractor);
  } catch (e) {
    return makeEmptyCommandResult(
      context.command,
      handlers.commandArgsError(context, e),
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
