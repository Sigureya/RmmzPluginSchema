import { JSONPathReader } from '../../../libs/jsonPath';
import { PluginArrayParamType, PluginParamEx2, PluginSchemaArrayFiltered, PluginScalarParam, PluginMinimumSchema } from '../../../rmmz/plugin';
import { CommandExtractorEntry } from './extractor/types';
import { PluginExtractorBundle } from './types';
export declare const createPluginCommandExtractor: (schema: PluginMinimumSchema, factoryFn: (path: string) => JSONPathReader) => CommandExtractorEntry[];
export declare const createPluginValueExtractor: <S extends PluginScalarParam, A extends PluginArrayParamType>(pluginName: string, schema: PluginSchemaArrayFiltered<PluginParamEx2<S, A>>, factoryFn: (path: string) => JSONPathReader) => PluginExtractorBundle;
