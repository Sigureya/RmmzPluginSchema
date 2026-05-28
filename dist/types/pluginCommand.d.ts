import { CommandArgExtractors, CommandMapKey, CommandExtractError, PluginCommandExtractErrorHandlers, PluginExtractedValue } from './features';
import { JSONValue } from './libs';
import { PluginCommandData } from './rmmz';
import { PluginExtractionResult } from './types';
export interface PluginCommandExtractionOutput {
    pluginName: string;
    commandName: string;
    args: PluginExtractedValue[];
    error?: CommandExtractError;
}
export declare const createCommandExtractorMapFromPipeline: <E>(input: PluginExtractionResult<E>) => Map<CommandMapKey, CommandArgExtractors>;
export declare const extractPluginCommandWithExtractor: (command: PluginCommandData, map: ReadonlyMap<CommandMapKey, CommandArgExtractors>, handlers: PluginCommandExtractErrorHandlers, parseFn?: (record: Record<string, string>) => Record<string, JSONValue>) => PluginCommandExtractionOutput;
