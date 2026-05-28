import { PluginParamsRecord } from './plugin';
export interface PluginParamReadContext {
    pluginName: string;
    record: PluginParamsRecord;
}
export interface PluginParamReadErrorHandlers<T> {
    pluginParamsParseError(context: PluginParamReadContext, error: unknown): T;
}
