import type { PluginCommandData } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesExtractorBundle } from "./bundle";
import type { PluginExtractedValue } from "./result";

export interface PluginCommandExtractContext {
  command: PluginCommandData;
  pluginName: string;
  commandName: string;
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

export interface PluginCommandExtractErrorHandlers {
  commandNotFoundError(
    context: PluginCommandExtractContext,
  ): CommandExtractError;
  commandParseError(
    context: PluginCommandExtractContext,
    error: unknown,
  ): CommandExtractError;
  commandArgsError(
    context: PluginCommandExtractContext,
    error: unknown,
  ): CommandExtractError;
}

export type CommandMapKey = `${string}:${string}`;
export type CommandExtractorEntry = [CommandMapKey, CommandArgExtractors];
