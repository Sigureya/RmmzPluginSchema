import { JSONValue } from '../../../libs/jsonPath';
export interface PluginInfo {
    name: string;
    status: boolean;
}
export interface PluginParamsRecord extends PluginInfo {
    name: string;
    status: boolean;
    description: string;
    parameters: Record<string, string>;
}
export interface PluginParamsObject extends PluginInfo {
    name: string;
    status: boolean;
    description: string;
    parameters: Record<string, JSONValue>;
}
