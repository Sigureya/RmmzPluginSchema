import { JSONPathReader, JSONValue } from '../../../libs/jsonPath';
import { ClassifiedPluginParams } from '../../../rmmz/plugin';
import { ParamExtractResult, PluginParamExtractor, PluginParamsSchema } from './extractor/types';
export declare const extractPluginParam: (value: JSONValue, paramExtractor: PluginParamExtractor) => ParamExtractResult;
export declare const compilePluginParamExtractor: (plugin: PluginParamsSchema, structMap: ReadonlyMap<string, ClassifiedPluginParams>, factoryFn: (path: string) => JSONPathReader) => PluginParamExtractor;
