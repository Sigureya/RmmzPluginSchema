import { PluginArrayParamType, ClassifiedPluginParamsTyped, PluginParamEx, PluginScalarParam, StructArrayRefParam, StructRefParam } from '../../../../rmmz/plugin';
import { ErrorCodes } from './types';
import { StructPathNodeListWithErrors } from './types/template';
export declare const getPathFromStructParam: <S extends PluginScalarParam, A extends PluginArrayParamType>(params: PluginParamEx<StructRefParam>, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParamsTyped<S, A>>, errors?: ErrorCodes) => StructPathNodeListWithErrors<S, A>;
export declare const getPathFromStructArraySchema: <S extends PluginScalarParam, A extends PluginArrayParamType>(param: PluginParamEx<StructArrayRefParam>, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParamsTyped<S, A>>, errors?: ErrorCodes) => StructPathNodeListWithErrors<S, A>;
export declare const getPathFromStructSchema: <S extends PluginScalarParam, A extends PluginArrayParamType>(structName: string, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParamsTyped<S, A>>, errors?: ErrorCodes) => StructPathNodeListWithErrors<S, A>;
