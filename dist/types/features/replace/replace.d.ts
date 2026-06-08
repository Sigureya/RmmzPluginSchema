import { JSONValue } from '../../libs/jsonPath';
import { PluginCommandData, PluginParamsObject, PluginParamsRecord } from '../../rmmz/plugin';
import { PluginCommandPathMap, PluginParamPathData } from './types';
export declare const replaceRuntimePluginCommand: (command: PluginCommandData, map: PluginCommandPathMap, replace: (value: string) => string | undefined) => PluginCommandData;
export declare const replacePluginParams: (plugin: PluginParamsObject, map: PluginParamPathData, replace: (value: string) => string | undefined) => PluginParamsRecord;
export declare const replacePluginValue: (params: Record<string, JSONValue>, paths: readonly (readonly string[])[], replace: (value: string) => string | undefined) => Record<string, JSONValue>;
