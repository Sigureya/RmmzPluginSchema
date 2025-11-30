import { ClassifiedPluginParams, PluginParamEx, ScalarParam, StructRefParam, PluginParam } from '../../../../rmmz/plugin';
import { PluginValuesPathBase, PrimitivePluginValuesPath } from './types';
export declare const createPluginValuesPath: (category: "param" | "args", rootName: string, param: PluginParam, structMap: ReadonlyMap<string, ClassifiedPluginParams>) => PluginValuesPathBase;
export declare const createPrimiteveParamPath: (category: "param" | "args", rootName: string, param: PluginParamEx<ScalarParam>) => PrimitivePluginValuesPath;
export declare const createStructParamPath: (category: "param" | "args", param: PluginParamEx<StructRefParam>, structMap: ReadonlyMap<string, ClassifiedPluginParams>) => PluginValuesPathBase;
