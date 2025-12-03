import { ArrayParamTypes, PluginParamEx, ScalarParam, StructRefParam, StructArrayRefParam, ClassifiedPluginParamsEx2 } from '../../../../rmmz/plugin';
import { PluginValuesPathEx, PrimitivePluginValuesPath } from './types';
export declare const createPluginValuesPath: <S extends ScalarParam, A extends ArrayParamTypes>(category: "param" | "args", rootName: string, param: PluginParamEx<S | A | StructRefParam | StructArrayRefParam>, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>) => PluginValuesPathEx<S, A>;
export declare const createPrimiteveParamPath: <T extends ScalarParam>(category: "param" | "args", rootName: string, param: PluginParamEx<T>) => PrimitivePluginValuesPath<T>;
export declare const createStructParamPath: <S extends ScalarParam, A extends ArrayParamTypes>(category: "param" | "args", param: PluginParamEx<StructRefParam>, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>) => PluginValuesPathEx<S, A>;
