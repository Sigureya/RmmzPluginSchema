import { JSONPathReader } from '../../libs/jsonPath';
import { PluginScalarParam, PluginArrayParamType, PluginParamsRecord } from '../../rmmz/plugin';
import { PluginSchemaOf } from '../../rmmz/plugin/core/pluginJSON2type';
import { CommandArgExtractors, CommandMapKey } from './core/extractor/types';
import { CommandExtractorEntryList, ConvertPluginResult } from './core/types';
export declare const mergeCommandMap: (list: ReadonlyArray<CommandExtractorEntryList>) => Map<CommandMapKey, CommandArgExtractors>;
export declare const jsonPathFromPluginSchema: <S extends PluginScalarParam, A extends PluginArrayParamType>(schema: PluginSchemaOf<S, A>, record: PluginParamsRecord, factoryFn: (path: string) => JSONPathReader) => ConvertPluginResult<S, A>;
/**
 * @deprecated Use `jsonPathFromPluginSchema` instead.
 */
export declare const convertPlugin: <S extends PluginScalarParam, A extends PluginArrayParamType>(schema: PluginSchemaOf<S, A>, record: PluginParamsRecord, factoryFn: (path: string) => JSONPathReader) => ConvertPluginResult<S, A>;
