import { JSONValue } from '../../../libs/jsonPath';
export interface PluginParamsRecord {
    name: string;
    status: boolean;
    description: string;
    parameters: Record<string, string>;
}
export interface PluginParamsObject {
    name: string;
    status: boolean;
    description: string;
    parameters: Record<string, JSONValue>;
}
