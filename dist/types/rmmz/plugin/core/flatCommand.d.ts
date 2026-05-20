import { PluginSchema } from './pluginJSON2type';
export interface FlatCommand {
    plugin: string;
    comand: string;
    name: string;
    text: string;
    kind: string;
    desc: string;
}
export interface FlatSchema {
    params: FlatCommand[];
    commands: FlatCommand[];
}
export declare const flatSchema: (schema: PluginSchema) => FlatSchema;
