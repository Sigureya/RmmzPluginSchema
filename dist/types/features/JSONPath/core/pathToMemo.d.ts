import { JSONPathReader } from '../../../libs/jsonPath';
import { PluginArrayParamType, PluginScalarParam } from '../../../rmmz/plugin';
import { PluginValuesPathSchema } from './createPath/types';
import { PluginValuesExtractorBundle } from './extractor/types';
type Type = "struct" | "structArray" | "scalar";
export interface CompileJSONPathErrorInfo<T> {
    path: string;
    valType: Type;
    error: unknown;
    handledInfo: T;
}
export interface CompileJSONPathResult<S extends PluginScalarParam, A extends PluginArrayParamType, T> {
    extractor: PluginValuesExtractorBundle<S, A>;
    errors: CompileJSONPathErrorInfo<T>[];
}
export declare const compileJSONPathSchema: <S extends PluginScalarParam, A extends PluginArrayParamType>(path: PluginValuesPathSchema<S, A>, factoryFn: (path: string) => JSONPathReader) => PluginValuesExtractorBundle<S, A>;
export {};
