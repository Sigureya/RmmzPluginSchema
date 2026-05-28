import { JSONValue } from '../../../libs/jsonPath';
import { PluginCommandData } from '../../../rmmz/plugin';
import { CommandArgExtractors, PluginCommandExtractErrorHandlers, CommandExtractResult, CommandMapKey } from './extractor/types';
export declare const extractArgsFromPluginCommand: (command: PluginCommandData, map: ReadonlyMap<CommandMapKey, CommandArgExtractors>, handlers: PluginCommandExtractErrorHandlers, parseFn?: (record: Record<string, string>) => Record<string, JSONValue>) => CommandExtractResult;
