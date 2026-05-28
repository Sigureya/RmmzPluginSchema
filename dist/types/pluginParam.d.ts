import { PluginExtractedValue } from './features';
import { PluginExtractionError, PluginExtractionResult } from './types';
export interface PluginParamExtractionOutput {
    pluginName: string;
    params: PluginExtractedValue[];
}
export interface PluginParamExtractionOutputWithError<E> {
    pluginName: string;
    params: PluginExtractedValue[];
    errors: PluginExtractionError<E>[];
}
export declare const createPluginParamsFromPipeline: (input: PluginExtractionResult<unknown>) => PluginParamExtractionOutput[];
export declare const createPluginParamsWithErrorsFromPipeline: <E>(input: PluginExtractionResult<E>) => PluginParamExtractionOutputWithError<E>[];
