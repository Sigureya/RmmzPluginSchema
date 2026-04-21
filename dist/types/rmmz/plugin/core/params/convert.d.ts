import { PluginCommandSchemaArrayFiltered, PluginCommandTypeEx, PluginParam, PluginParamEx, PluginStructSchemaArray, PluginStructType, PrimitiveParam, PluginScalarParam } from './types';
export declare function toObjectPluginParamsOld(params: ReadonlyArray<PluginParam>): Record<string, PrimitiveParam>;
export declare function toObjectPluginParams<S extends PluginScalarParam>(params: ReadonlyArray<PluginParamEx<S>>): Record<string, S>;
export declare const toArrayPluginParam: <P extends Partial<Record<string, PrimitiveParam>>>(params: P) => PluginParamEx<P[Extract<keyof P, string>] & PrimitiveParam, Extract<keyof P, string>>[];
export declare const convertStructSchema: <T extends PluginStructSchemaArray>(schema: T) => PluginStructType<object>;
export declare const convertPluginCommandSchema: <T extends PluginParam>(command: PluginCommandSchemaArrayFiltered<T>) => PluginCommandTypeEx<object>;
