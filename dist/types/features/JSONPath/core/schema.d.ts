import { JSONPathReader } from '../../../libs/jsonPath';
import { PluginSchemaArray } from '../../../rmmz/plugin';
import { PluginExtractorBundle } from './types';
export declare const createPluginValueExtractor: (pluginName: string, schema: PluginSchemaArray, factoryFn: (path: string) => JSONPathReader) => PluginExtractorBundle;
