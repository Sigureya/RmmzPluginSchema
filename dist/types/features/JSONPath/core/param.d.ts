import { JSONPathReader, JSONValue } from '../../../libs/jsonPath';
import { ClassifiedPluginParams, PluginParamsRecord } from '../../../rmmz/plugin';
import { ExtractorBundle, ParamExtractResult, PluginParamExtractor, PluginParamsSchema } from './extractor/types';
export declare const extractPluginParamFromRecord: (record: PluginParamsRecord, paramExtractor: ReadonlyArray<ExtractorBundle>) => ParamExtractResult;
export declare const extractPluginParam: (value: JSONValue, paramExtractor: PluginParamExtractor) => ParamExtractResult;
export declare const compilePluginParamExtractor: (plugin: PluginParamsSchema, structMap: ReadonlyMap<string, ClassifiedPluginParams>, factoryFn: (path: string) => JSONPathReader) => PluginParamExtractor;
