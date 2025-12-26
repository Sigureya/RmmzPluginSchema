import { PluginArrayParamType, PluginParamEx2, PluginScalarParam } from '../../../../../rmmz/plugin';
import { PluginValuesExtractorBundle } from './bundle';
import { PluginValues } from './result';
export interface PluginParamsSchema<S extends PluginScalarParam = PluginScalarParam, A extends PluginArrayParamType = PluginArrayParamType> {
    pluginName: string;
    schema: {
        params: PluginParamEx2<S, A>[];
    };
}
export interface PluginParamExtractor<S extends PluginScalarParam = PluginScalarParam, A extends PluginArrayParamType = PluginArrayParamType> {
    pluginName: string;
    extractors: PluginValuesExtractorBundle<S, A>[];
}
export interface ParamExtractResult {
    pluginName: string;
    params: PluginValues[];
}
