import { PluginArrayParamType, PluginParamEx2, PluginSchemaArray, PluginSchemaArrayFiltered, PluginScalarParam, PluginCommandSchemaArray, PluginStructSchemaArray } from './params';
import { PluginDependencies } from './parse';
export interface PluginMinimumSchema {
    pluginName: string;
    schema: {
        commands: PluginCommandSchemaArray[];
        structs: PluginStructSchemaArray[];
    };
}
export interface PluginMetaKeywords {
    author?: string;
    plugindesc?: string;
    url?: string;
}
export interface PluginSchema extends PluginMinimumSchema {
    locale?: string;
    pluginName: string;
    target: string;
    meta: PluginMetaKeywords;
    dependencies: PluginDependencies;
    schema: PluginSchemaArray;
}
export interface PluginSchemaOf<S extends PluginScalarParam, A extends PluginArrayParamType> extends PluginSchema {
    schema: PluginSchemaArrayFiltered<PluginParamEx2<S, A>>;
}
