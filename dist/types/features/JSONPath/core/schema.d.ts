import { JSONPathReader } from '../../../libs/jsonPath';
import { PluginArrayParamType, PluginParamEx2, PluginSchemaArrayFiltered, PluginScalarParam } from '../../../rmmz/plugin';
import { PluginExtractorBundle } from './types';
export declare const createPluginValueExtractor: <S extends PluginScalarParam, A extends PluginArrayParamType>(pluginName: string, schema: PluginSchemaArrayFiltered<PluginParamEx2<S, A>>, factoryFn: (path: string) => JSONPathReader) => PluginExtractorBundle;
