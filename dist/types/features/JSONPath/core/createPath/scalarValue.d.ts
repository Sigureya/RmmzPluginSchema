import { PluginParamEx, ScalarParam, ArrayParamTypes } from '../../../../rmmz/plugin';
import { ArrayParamPathPair } from './types';
export declare const makeScalarValuesPath: (scalas: ReadonlyArray<PluginParamEx<ScalarParam>>, parent: string) => string | undefined;
export declare const makeScalarArrayPath: (scalaArrays: ReadonlyArray<PluginParamEx<ArrayParamTypes>>, parent: string) => ArrayParamPathPair[];
