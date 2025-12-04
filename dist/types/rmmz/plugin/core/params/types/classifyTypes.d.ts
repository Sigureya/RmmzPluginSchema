import { PluginParamEx } from './arrayParamItems';
import { PluginScalarParam, PluginArrayParamType, PrimitiveParam } from './paramUnion';
import { PluginStructParamTypeEx } from './pluginSchemaType';
import { StructRefParam, StructArrayRefParam } from './primitive';
export interface ScalaStruct {
    scalars: PluginParamEx<PluginScalarParam>[];
    scalarArrays: PluginParamEx<PluginArrayParamType>[];
}
export interface ClassifiedPluginParams extends ScalaStruct {
    structs: PluginParamEx<StructRefParam>[];
    structArrays: PluginParamEx<StructArrayRefParam>[];
    scalars: PluginParamEx<PluginScalarParam>[];
    scalarArrays: PluginParamEx<PluginArrayParamType>[];
}
export interface ClassifiedPluginParamsEx2<S extends PluginScalarParam, A extends PluginArrayParamType> extends ClassifiedPluginParams {
    structs: PluginParamEx<StructRefParam>[];
    structArrays: PluginParamEx<StructArrayRefParam>[];
    scalars: PluginParamEx<S>[];
    scalarArrays: PluginParamEx<A>[];
}
type ParamTypesEx4<T, Attr extends PrimitiveParam> = Extract<PluginStructParamTypeEx<T>, {
    attr: Attr;
    name: string;
}>;
export type ClassifiedPluginParamsEx<T, S extends PluginScalarParam = PluginScalarParam, A extends PluginArrayParamType = PluginArrayParamType> = ClassifiedPluginParamsEx2<S, A> & {
    structs: ParamTypesEx4<T, StructRefParam>[];
    structArrays: ParamTypesEx4<T, StructArrayRefParam>[];
    scalars: ParamTypesEx4<T, PluginScalarParam>[];
    scalarArrays: ParamTypesEx4<T, PluginArrayParamType>[];
};
export {};
