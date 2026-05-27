import type { PluginCommandData } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesExtractorBundle } from "./bundle";
import type { PluginExtractedValue } from "./result";

export interface CommandBuildResult<T> {
  extractors: CommandArgExtractors[];
  errors: T[];
}

export interface CommandArgExtractors {
  pluginName: string;
  commandName: string;
  desc: string;
  text: string;
  extractors: PluginValuesExtractorBundle[];
}

export interface CommandExtractResult {
  pluginName: string;
  commandName: string;
  args: PluginExtractedValue[];
  error?: CommandExtractError;
}

export interface CommandExtractError {
  message: string;
  source: string;
}

export interface CommandExtractMessageHandlers {
  undefinedCommand(command: PluginCommandData): CommandExtractError;
  deepJSONParseError(
    command: PluginCommandData,
    error: unknown,
  ): CommandExtractError;
  extractArgsError(
    command: PluginCommandData,
    error: unknown,
  ): CommandExtractError;
}

export type CommandMapKey = `${string}:${string}`;
export type CommandExtractorEntry = [CommandMapKey, CommandArgExtractors];
