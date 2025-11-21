import { ClassifiedPluginParams, PluginParamEx, ScalarParam, StructRefParam, PluginParam } from '../../../../rmmz/plugin';
import { PluginValuesPathNewVersion, PrimitivePluginValuesPath } from './types';
export declare const createPluginValuesPathPP2: (category: "param" | "args", rootName: string, param: PluginParam, structMap: ReadonlyMap<string, ClassifiedPluginParams>) => PluginValuesPathNewVersion;
export declare const eee: (category: "param" | "args", rootName: string, param: PluginParamEx<ScalarParam>) => PrimitivePluginValuesPath;
export declare const createPluginValuesPathPP: (category: "param" | "args", param: PluginParamEx<StructRefParam>, structMap: ReadonlyMap<string, ClassifiedPluginParams>) => PluginValuesPathNewVersion;
