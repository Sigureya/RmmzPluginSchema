import { PluginParamEx, PluginScalarParam, PluginArrayParamType } from '../../../../rmmz/plugin';
import { ArrayParamPathPair } from './types';
export declare const makeScalarValuesPath: (scalas: ReadonlyArray<PluginParamEx<PluginScalarParam>>, parent: string) => string | undefined;
export declare const makeScalarArrayPath: <T extends PluginParamEx<PluginArrayParamType>>(scalaArrays: ReadonlyArray<T>, parent: string) => ArrayParamPathPair<T>[];
