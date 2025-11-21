import { JSONPathReader, JSONValue } from '../../../libs/jsonPath';
import { PluginSchema, PluginCommandSchemaArray, ClassifiedPluginParams } from '../../../rmmz/plugin';
import { CommandArgExtractors, CommandExtractResult, CommandMapKey } from './commandTypes';
export declare const compilePluginCommandExtractor: (pluginName: string, schema: PluginCommandSchemaArray, structMap: ReadonlyMap<string, ClassifiedPluginParams>, factoryFn: (path: string) => JSONPathReader) => CommandArgExtractors;
export declare const extractPluginCommandArgs: (value: JSONValue, extractor: CommandArgExtractors) => CommandExtractResult;
export declare const extractCommandArgsByKey: (value: JSONValue, key: CommandMapKey, map: ReadonlyMap<CommandMapKey, CommandArgExtractors>) => CommandExtractResult | undefined;
export declare const compileCommandExtractorsFromPlugins: (plugins: ReadonlyArray<PluginSchema>, factoryFn: (path: string) => JSONPathReader) => Map<CommandMapKey, CommandArgExtractors>;
