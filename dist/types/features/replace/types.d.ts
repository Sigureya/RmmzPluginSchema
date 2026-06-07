export interface PluginReplacePathData extends PluginParamPathData {
    pluginName: string;
    paramsPath: string[][];
    commands: PluginCommandPathData[];
}
export interface PluginParamPathData {
    pluginName: string;
    paramsPath: string[][];
}
export interface PluginCommandPathData {
    commandName: string;
    argsPath: string[][];
}
export type PluginCommandPathMap = ReadonlyMap<string, {
    argsPath: string[][];
}>;
