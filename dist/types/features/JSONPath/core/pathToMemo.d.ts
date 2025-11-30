import { JSONPathReader } from '../../../libs/jsonPath';
import { PluginValuesPathBase } from './createPath/types';
import { ExtractorBundle } from './extractor/types';
export declare const compileJSONPathSchema: (path: PluginValuesPathBase, factoryFn: (path: string) => JSONPathReader) => ExtractorBundle;
