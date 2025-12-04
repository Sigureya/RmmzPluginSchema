import { PluginArrayParamType, PluginParamEx2, PluginScalarParam } from '../../../../../rmmz/plugin';
import { PluginValuesExtractorBundle } from './bundle';
import { PluginValues } from './result';
export interface PluginParamsSchema<S extends PluginScalarParam, A extends PluginArrayParamType> {
    pluginName: string;
    schema: {
        params: PluginParamEx2<S, A>[];
    };
}
export interface PluginParamExtractor {
    pluginName: string;
    extractors: PluginValuesExtractorBundle[];
}
export interface ParamExtractResult {
    pluginName: string;
    params: PluginValues[];
}
