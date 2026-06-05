import { JSONPathReader } from '../../../libs/jsonPath';
import { PluginArrayParamType, PluginParamEx2, PluginSchemaArrayFiltered, PluginScalarParam, PluginCommandMinimumSchema } from '../../../rmmz/plugin';
import { CommandExtractorEntry, CommandMapKey, CommandArgExtractors } from './extractor/types';
import { PluginExtractorBundle } from './types';
/**
 * @deprecated pipelines 起点の現行フローでは未使用です。`buildPluginValueExtractor` を利用してください。
 */
export declare const createPluginCommandExtractorMap: (schema: ReadonlyArray<PluginCommandMinimumSchema>, factoryFn: (path: string) => JSONPathReader) => Map<CommandMapKey, CommandArgExtractors>;
/**
 * @deprecated pipelines 起点の現行フローでは未使用です。`buildPluginValueExtractor` を利用してください。
 */
export declare const createPluginCommandExtractor: (schema: PluginCommandMinimumSchema, factoryFn: (path: string) => JSONPathReader) => CommandExtractorEntry[];
/**
 * @deprecated pipelines 起点の現行フローでは未使用です。`buildPluginValueExtractor` を利用してください。
 */
export declare const createPluginValueExtractor: <S extends PluginScalarParam, A extends PluginArrayParamType>(pluginName: string, schema: PluginSchemaArrayFiltered<PluginParamEx2<S, A>>, factoryFn: (path: string) => JSONPathReader) => PluginExtractorBundle;
export declare const pluginComamndName: (pluginName: string, commandName: string) => CommandMapKey;
