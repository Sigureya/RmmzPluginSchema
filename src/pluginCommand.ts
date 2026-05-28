import type {
  CommandArgExtractors,
  CommandMapKey,
  CommandExtractError,
  PluginCommandExtractErrorHandlers,
  PluginExtractedValue,
} from "./features";
import { extractArgsFromPluginCommand } from "./features/JSONPath/core/command2";
import type { JSONValue } from "./libs";
import type { PluginCommandData } from "./rmmz";
import { parseDeepRecord } from "./rmmz";
import type { PluginCommandExtractorSource } from "./types";

export interface PluginCommandExtractionOutput {
  pluginName: string;
  commandName: string;
  args: PluginExtractedValue[];
  error?: CommandExtractError;
}

export const createCommandExtractorMapFromPipeline = (
  input: PluginCommandExtractorSource,
): Map<CommandMapKey, CommandArgExtractors> => {
  const entries = input.plugins.flatMap((plugin) =>
    plugin.commandExtractors.map(
      (extractor): [CommandMapKey, CommandArgExtractors] => [
        `${extractor.pluginName}:${extractor.commandName}`,
        extractor,
      ],
    ),
  );
  return new Map(entries);
};

export const extractPluginCommandWithExtractor = (
  command: PluginCommandData,
  map: ReadonlyMap<CommandMapKey, CommandArgExtractors>,
  handlers: PluginCommandExtractErrorHandlers,
  parseFn: (
    record: Record<string, string>,
  ) => Record<string, JSONValue> = parseDeepRecord,
): PluginCommandExtractionOutput => {
  const result = extractArgsFromPluginCommand(command, map, handlers, parseFn);
  return {
    pluginName: result.pluginName,
    commandName: result.commandName,
    args: result.args,
    error: result.error,
  };
};
