import { PluginSchemaArray } from './params';
import { PluginDependencies } from './parse';
export interface PluginSchema {
    pluginName: string;
    target: string;
    meta: Record<string, string>;
    dependencies?: PluginDependencies;
    schema: PluginSchemaArray;
}
