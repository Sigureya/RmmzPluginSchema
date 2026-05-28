import { JSONPathReader } from '../../../libs/jsonPath';
import { ClassifiedPluginParams, PluginParam } from '../../../rmmz/plugin';
import { StructPathError } from './createPath/types';
import { PluginValuesExtractorBundle } from './extractor/types';
import { PluginErrorStruct } from './extractor/types/error';
export interface ParamBuildErrorHandlers<E> {
    paramStructPathError(context: ParamBuildContext, error: StructPathError): E;
    paramCompileJSONPathSchemaError(context: ParamBuildContext, error: unknown): E;
}
export interface ParamBuildContext {
    pluginName: string;
    paramName: string;
}
interface BuildSingleParamResult {
    extractor: PluginValuesExtractorBundle;
    errors: PluginErrorStruct[];
}
export declare const buildSingleParam: (pluginName: string, param: PluginParam, structMap: ReadonlyMap<string, ClassifiedPluginParams>, factoryFn: (path: string) => JSONPathReader, handlers: ParamBuildErrorHandlers<PluginErrorStruct>) => BuildSingleParamResult;
export {};
