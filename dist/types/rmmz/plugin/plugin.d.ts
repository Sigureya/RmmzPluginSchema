import { JSONValue } from '../../libs/jsonPath';
import { PluginSchema } from './core';
import { PluginJSON } from './core/pluginJSONTypes';
import { PluginParamsObject, PluginParamsRecord } from './pluginsJS/types';
import { PluginInput } from './types';
export declare const paramObjectFromPluginRecord: (record: PluginParamsRecord) => Record<string, JSONValue>;
export declare const pluginSourceToJSON: (text: string) => PluginJSON;
export declare const pluginSourceToArraySchema: (input: PluginInput) => PluginSchema;
export declare const parsePluginParamObject: (src: string) => PluginParamsObject[];
