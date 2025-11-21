import { JSONPathReader } from '../../../libs/jsonPath';
import { PluginValuesPath2 } from './createPath/types';
import { ExtractorBundle } from './extractor/types';
export declare const compileJSONPathSchema: (path: PluginValuesPath2, factoryFn: (path: string) => JSONPathReader) => ExtractorBundle;
