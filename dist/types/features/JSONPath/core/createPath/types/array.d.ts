import { PluginParamEx, ArrayParamTypes } from '../../../../../rmmz/plugin';
export interface ArrayParamPathPair {
    path: `${string}[*]`;
    param: PluginParamEx<ArrayParamTypes>;
}
