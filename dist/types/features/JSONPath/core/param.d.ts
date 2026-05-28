import { JSONPathReader, JSONValue } from '../../../libs/jsonPath';
import { ClassifiedPluginParamsTyped, PluginArrayParamType, PluginParamsRecord, PluginScalarParam } from '../../../rmmz/plugin';
import { PluginParamReadErrorHandlers } from '../../../rmmz/plugin/pluginsJS/types/handlers';
import { PluginExtractedValue, PluginParamExtractor, PluginParamsSchema, PluginValuesExtractorBundle } from './extractor/types';
export interface ParamReadResult<T> {
    errorInfo: T | null;
    pluginName: string;
    params: PluginExtractedValue[];
    errorKind: "parseError" | "";
}
export declare const extractPluginParamFromRecord: <T>(record: PluginParamsRecord, paramExtractor: ReadonlyArray<PluginValuesExtractorBundle>, parseFn: (value: Record<string, string>) => Record<string, JSONValue>, errorHandlers: PluginParamReadErrorHandlers<T>) => ParamReadResult<T>;
export declare const compilePluginParamExtractor: <S extends PluginScalarParam, A extends PluginArrayParamType>(plugin: PluginParamsSchema<S, A>, structMap: ReadonlyMap<string, ClassifiedPluginParamsTyped<S, A>>, factoryFn: (path: string) => JSONPathReader) => PluginParamExtractor<S, A>;
