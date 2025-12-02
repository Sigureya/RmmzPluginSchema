import { PluginParam } from '../../../../../rmmz/plugin';
import { ExtractorBundle } from './bundle';
import { PluginValues } from './result';
export interface PluginParamsSchema {
    pluginName: string;
    schema: {
        params: PluginParam[];
    };
}
export interface PluginParamExtractor {
    pluginName: string;
    extractors: ExtractorBundle[];
}
export interface ParamExtractResult {
    pluginName: string;
    params: PluginValues[];
}
