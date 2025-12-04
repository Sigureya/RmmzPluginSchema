import { JSONPathReader, JSONValue } from '../../../libs/jsonPath';
import { PluginSchema, PluginCommandSchemaArray, PluginArrayParamType, PluginScalarParam, ClassifiedPluginParamsEx2 } from '../../../rmmz/plugin';
import { CommandArgExtractors, CommandExtractResult, CommandMapKey, CommandExtractorEntry } from './extractor/types';
export declare const compilePluginCommandExtractor: <S extends PluginScalarParam, A extends PluginArrayParamType>(pluginName: string, schema: PluginCommandSchemaArray, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>, factoryFn: (path: string) => JSONPathReader) => CommandArgExtractors;
export declare const extractPluginCommandArgs: (value: JSONValue, extractor: CommandArgExtractors) => CommandExtractResult;
export declare const extractCommandArgsByKey: (value: JSONValue, key: CommandMapKey, map: ReadonlyMap<CommandMapKey, CommandArgExtractors>) => CommandExtractResult | undefined;
/**
 * @deprecated
 */
export declare const compileCommandExtractorsFromPlugins: (plugins: ReadonlyArray<PluginSchema>, factoryFn: (path: string) => JSONPathReader) => Map<CommandMapKey, CommandArgExtractors>;
/**
 * @deprecated
 */
export declare const compilePluginCommandPairs: (plugin: PluginSchema, factoryFn: (path: string) => JSONPathReader) => CommandExtractorEntry[];
