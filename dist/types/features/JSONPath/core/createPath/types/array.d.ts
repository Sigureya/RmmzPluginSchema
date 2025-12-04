import { PluginParamEx, PluginArrayParamType } from '../../../../../rmmz/plugin';
export interface ArrayParamPathPair<T extends PluginParamEx<PluginArrayParamType> = PluginParamEx<PluginArrayParamType>> {
    path: `${string}[*]`;
    param: T;
}
