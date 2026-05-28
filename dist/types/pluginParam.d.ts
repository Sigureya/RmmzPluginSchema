import { PluginExtractedValue } from './features';
import { PluginExtractionError, PluginParamSource, PluginParamSourceWithErrors } from './types';
export interface PluginParamExtractionOutput {
    pluginName: string;
    params: PluginExtractedValue[];
}
export interface PluginParamExtractionOutputWithError<E> {
    pluginName: string;
    params: PluginExtractedValue[];
    errors: PluginExtractionError<E>[];
}
export declare const createPluginParamsFromPipeline: (input: PluginParamSource) => PluginParamExtractionOutput[];
export declare const createPluginParamsWithErrorsFromPipeline: <E>(input: PluginParamSourceWithErrors<E>) => PluginParamExtractionOutputWithError<E>[];
