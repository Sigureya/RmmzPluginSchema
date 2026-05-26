import { JSONPathReader } from '../../libs/jsonPath';
import { PluginScalarParam, PluginArrayParamType, PluginParamsRecord, PluginCommandData } from '../../rmmz/plugin';
import { PluginSchemaOf } from '../../rmmz/plugin/core/pluginJSON2type';
import { CommandArgExtractors, CommandExtractResult, CommandMapKey } from './core/extractor/types';
import { CommandExtractorEntryList, ConvertPluginResultEx } from './core/types';
export declare const extractArgsFromPluiginCommand: (command: PluginCommandData, map: ReadonlyMap<CommandMapKey, CommandArgExtractors>, parseFn?: (record: Record<string, string>) => Record<string, import('../../libs/jsonPath').JSONValue>) => CommandExtractResult | undefined;
export declare const mergeCommandMap: (list: ReadonlyArray<CommandExtractorEntryList>) => Map<CommandMapKey, CommandArgExtractors>;
export declare const jsonPathFromPluginSchema: <S extends PluginScalarParam, A extends PluginArrayParamType>(schema: PluginSchemaOf<S, A>, record: PluginParamsRecord, factoryFn: (path: string) => JSONPathReader) => ConvertPluginResultEx<S, A>;
/**
 * @deprecated Use `jsonPathFromPluginSchema` instead.
 */
export declare const convertPlugin: <S extends PluginScalarParam, A extends PluginArrayParamType>(schema: PluginSchemaOf<S, A>, record: PluginParamsRecord, factoryFn: (path: string) => JSONPathReader) => ConvertPluginResultEx<S, A>;
