import { PluginParamEx, ScalarParam, ArrayParamTypes } from '../../../../rmmz/plugin';
import { ArrayParamPathPairEx } from './types';
export declare const makeScalarValuesPath: (scalas: ReadonlyArray<PluginParamEx<ScalarParam>>, parent: string) => string | undefined;
export declare const makeScalarArrayPath: <T extends PluginParamEx<ArrayParamTypes>>(scalaArrays: ReadonlyArray<T>, parent: string) => ArrayParamPathPairEx<T>[];
