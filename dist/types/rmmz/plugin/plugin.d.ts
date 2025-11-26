import { PluginSchema } from './core';
import { PluginJSON } from './core/pluginJSONTypes';
import { PluginParamsObject } from './pluginsJS/types';
export declare const pluginSourceToJSON: (text: string) => PluginJSON;
export declare const pluginSourceToArraySchema: (plguinName: string, text: string) => PluginSchema;
export declare const parsePluginParamObject: (src: string) => PluginParamsObject[];
