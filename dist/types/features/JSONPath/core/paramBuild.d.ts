import { JSONPathReader } from '../../../libs/jsonPath';
import { PluginParam, ClassifiedPluginParams } from '../../../rmmz/plugin';
import { ParamBuildErrorHandlers } from './createPath';
import { PluginValuesExtractorBundle, PluginErrorStruct } from './extractor/types';
interface BuildSingleParamResult {
    extractor: PluginValuesExtractorBundle;
    errors: PluginErrorStruct[];
}
export declare const buildSingleParam: (pluginName: string, param: PluginParam, structMap: ReadonlyMap<string, ClassifiedPluginParams>, factoryFn: (path: string) => JSONPathReader, handlers: ParamBuildErrorHandlers<PluginErrorStruct>) => BuildSingleParamResult;
export {};
