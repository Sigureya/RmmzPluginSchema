import { PluginArrayParamType, PluginParamEx, PluginScalarParam, StructRefParam, ClassifiedPluginParamsEx2, PluginParamEx2 } from '../../../../rmmz/plugin';
import { PluginValuesPathSchema, PrimitivePluginValuesPath } from './types';
type PAUnion = "param" | "args";
export declare const createPluginValuesPath: <S extends PluginScalarParam, A extends PluginArrayParamType>(category: PAUnion, rootName: string, param: PluginParamEx2<S, A>, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>) => PluginValuesPathSchema<S, A>;
export declare const createPrimiteveParamPath: <T extends PluginScalarParam>(category: PAUnion, rootName: string, param: PluginParamEx<T>) => PrimitivePluginValuesPath<T>;
export declare const createStructParamPath: <S extends PluginScalarParam, A extends PluginArrayParamType>(category: PAUnion, param: PluginParamEx<StructRefParam>, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>) => PluginValuesPathSchema<S, A>;
export {};
