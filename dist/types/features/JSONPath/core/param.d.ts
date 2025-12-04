import { JSONPathReader, JSONValue } from '../../../libs/jsonPath';
import { PluginArrayParamType, ClassifiedPluginParamsEx2, PluginParamsRecord, PluginScalarParam } from '../../../rmmz/plugin';
import { PluginValuesExtractorBundle, ParamExtractResult, PluginParamExtractor, PluginParamsSchema } from './extractor/types';
export declare const extractPluginParamFromRecord: (record: PluginParamsRecord, paramExtractor: ReadonlyArray<PluginValuesExtractorBundle>) => ParamExtractResult;
export declare const extractPluginParam: (value: JSONValue, paramExtractor: PluginParamExtractor) => ParamExtractResult;
export declare const compilePluginParamExtractor: <S extends PluginScalarParam, A extends PluginArrayParamType>(plugin: PluginParamsSchema<S, A>, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>, factoryFn: (path: string) => JSONPathReader) => PluginParamExtractor;
