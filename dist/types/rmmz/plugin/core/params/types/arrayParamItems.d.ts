import { ParamError } from './error';
import { PluginArrayParamType, PrimitiveParam, PluginScalarParam } from './paramUnion';
import { StructArrayRefParam, StructRefParam } from './primitive';
export interface PluginParam {
    name: string;
    attr: PrimitiveParam;
    erros?: ParamError[];
}
export interface PluginParamEx<T extends PrimitiveParam, N extends string = string> extends PluginParam {
    name: Extract<N, string>;
    attr: T;
    erros?: ParamError[];
}
export type PluginParamEx2<S extends PluginScalarParam, A extends PluginArrayParamType, N extends string = string> = PluginParamEx<S | A | StructRefParam | StructArrayRefParam, N>;
export type StructPluginParam = PluginParamEx<StructRefParam | StructArrayRefParam>;
