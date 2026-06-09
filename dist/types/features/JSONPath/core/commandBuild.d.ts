import { JSONPathReader, JSONValue } from '../../../libs/jsonPath';
import { PluginCommandData, ClassifiedPluginParams, PluginCommandSchemaArray } from '../../../rmmz/plugin';
import { CommandBuildErrorHandlers } from './createPath/types/handlers';
import { CommandArgExtractors, CommandExtractError, CommandMapKey, PluginCommandExtractErrorHandlers, PluginCommandExtractorSource, PluginExtractedValue } from './extractor/types';
import { ErrorStruct } from './extractor/types/error';
export interface PluginCommandExtractionOutput {
    pluginName: string;
    commandName: string;
    args: PluginExtractedValue[];
    error?: CommandExtractError;
}
export declare const createCommandExtractorMapFromPipeline: (input: PluginCommandExtractorSource) => Map<CommandMapKey, CommandArgExtractors>;
export declare const extractPluginCommandWithExtractor: (command: PluginCommandData, map: ReadonlyMap<CommandMapKey, CommandArgExtractors>, handlers: PluginCommandExtractErrorHandlers, parseFn?: (record: Record<string, string>) => Record<string, JSONValue>) => PluginCommandExtractionOutput;
export declare const buildSingleCommand: (pluginName: string, schema: PluginCommandSchemaArray, structMap: ReadonlyMap<string, ClassifiedPluginParams>, factoryFn: (path: string) => JSONPathReader, handlers: CommandBuildErrorHandlers<ErrorStruct>) => {
    extractor: CommandArgExtractors;
    errors: ErrorStruct[];
};
