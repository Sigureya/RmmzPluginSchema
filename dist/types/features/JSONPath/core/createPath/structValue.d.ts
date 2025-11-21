import { ClassifiedPluginParams, PluginParamEx, StructArrayRefParam, StructRefParam } from '../../../../rmmz/plugin';
import { ErrorCodes, StructPathResultWithError } from './types';
export declare const getPathFromStructParam: (params: ReadonlyArray<PluginParamEx<StructRefParam>>, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParams>, errors?: ErrorCodes) => StructPathResultWithError;
export declare const getPathFromStructArraySchema: (param: ReadonlyArray<PluginParamEx<StructArrayRefParam>>, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParams>, errors?: ErrorCodes) => StructPathResultWithError;
export declare const getPathFromStructSchema: (structName: string, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParams>, errors?: ErrorCodes) => StructPathResultWithError;
