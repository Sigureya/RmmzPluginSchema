import { PluginArrayParamType, ClassifiedPluginParamsEx2, PluginParamEx, PluginScalarParam, ScalaStruct, StructArrayRefParam, StructRefParam } from '../../../../rmmz/plugin';
import { ErrorCodes } from './types';
import { TemplateGE } from './types/template';
interface ClassifiedPluginParamsEx3<S extends PluginParamEx<PluginScalarParam>, A extends PluginParamEx<PluginArrayParamType>> extends ScalaStruct {
    structs: PluginParamEx<StructRefParam>[];
    structArrays: PluginParamEx<StructArrayRefParam>[];
    scalars: S[];
    scalarArrays: A[];
}
export declare const getPathFromStructParam: <S extends PluginParamEx<PluginScalarParam>, A extends PluginParamEx<PluginArrayParamType>>(params: PluginParamEx<StructRefParam>, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx3<S, A>>, errors?: ErrorCodes) => TemplateGE<S["attr"], A["attr"]>;
export declare const getPathFromStructArraySchema: <S extends PluginScalarParam, A extends PluginArrayParamType>(param: PluginParamEx<StructArrayRefParam>, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>, errors?: ErrorCodes) => TemplateGE<S, A>;
export declare const getPathFromStructSchema: <S extends PluginParamEx<PluginScalarParam>, A extends PluginParamEx<PluginArrayParamType>>(structName: string, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx3<S, A>>, errors?: ErrorCodes) => TemplateGE<S["attr"], A["attr"]>;
export {};
