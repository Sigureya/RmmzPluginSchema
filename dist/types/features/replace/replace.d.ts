import { DeepJSONValue, PluginCommandData, PluginParamsObject, PluginParamsRecord } from '../../rmmz/plugin';
import { PluginCommandPathMap, PluginParamPathData } from './types';
type DeepJSONObject = Record<string, DeepJSONValue>;
export declare const replaceRuntimePluginCommand: (command: PluginCommandData, map: PluginCommandPathMap, replace: (value: string) => string | undefined) => PluginCommandData;
export declare const replacePluginParams: (plugin: PluginParamsObject, map: PluginParamPathData, replace: (value: string) => string | undefined) => PluginParamsRecord;
export declare const replacePluginValue: (params: DeepJSONObject, paths: readonly (readonly string[])[], replace: (value: string) => string | undefined) => DeepJSONObject;
export {};
