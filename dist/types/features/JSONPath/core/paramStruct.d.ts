import { ClassifiedPluginParams, PluginParamEx, StructRefParam } from '../../../rmmz/plugin';
import { ErrorCodes, StructPathResult } from './types';
export declare const getPathFromStructParam: (params: ReadonlyArray<PluginParamEx<StructRefParam>>, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParams>, errors?: ErrorCodes) => StructPathResult;
export declare const getPathFromStructSchema: (structName: string, parent: string, structMap: ReadonlyMap<string, ClassifiedPluginParams>, errors?: ErrorCodes) => StructPathResult;
