import { JSONValue } from '../../libs/jsonPath';
import { PluginCommandData } from '../../rmmz/plugin';
import { PluginCommandPathMap } from './types';
export declare const replaceRuntimePluginCommand: (command: PluginCommandData, map: PluginCommandPathMap, replace: (value: string) => string | undefined) => PluginCommandData;
export declare const replacePluginValue: (params: Record<string, JSONValue>, paths: readonly (readonly string[])[], replace: (value: string) => string | undefined) => Record<string, JSONValue>;
