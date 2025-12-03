import { ArrayParamTypes, ClassifiedPluginParamsEx2, PluginParamEx, ScalarParam, ScalaStruct, StructArrayRefParam, StructRefParam } from '../../../../rmmz/plugin';
import { ErrorCodes } from './types';
import { TemplateGE } from './types/template';
interface ClassifiedPluginParamsEx3<S extends PluginParamEx<ScalarParam>, A extends PluginParamEx<ArrayParamTypes>> extends ScalaStruct {
    structs: PluginParamEx<StructRefParam>[];
    structArrays: PluginParamEx<StructArrayRefParam>[];
    scalars: S[];
    scalarArrays: A[];
}
export declare const getPathFromStructParam: <S extends PluginParamEx<ScalarParam>, A extends PluginParamEx<ArrayParamTypes>>(params: PluginParamEx<StructRefParam>, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx3<S, A>>, errors?: ErrorCodes) => TemplateGE<S["attr"], A["attr"]>;
export declare const getPathFromStructArraySchema: <S extends ScalarParam, A extends ArrayParamTypes>(param: PluginParamEx<StructArrayRefParam>, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>, errors?: ErrorCodes) => TemplateGE<S, A>;
export declare const getPathFromStructSchema: <S extends PluginParamEx<ScalarParam>, A extends PluginParamEx<ArrayParamTypes>>(structName: string, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParamsEx3<S, A>>, errors?: ErrorCodes) => TemplateGE<S["attr"], A["attr"]>;
export {};
