import { PluginCommandSchemaArrayFiltered, PluginCommandTypeEx, PluginParam, PluginParamEx, PluginStructSchemaArray, PluginStructType, PrimitiveParam, ObjectParamsV5, PluginScalarParam } from './types';
export declare function toObjectPluginParamsOld(params: ReadonlyArray<PluginParam>): Record<string, PrimitiveParam>;
export declare function toObjectPluginParams<S extends PluginScalarParam>(params: ReadonlyArray<PluginParamEx<S>>): Record<string, S>;
export declare const toArrayPluginParam: <T extends PrimitiveParam, K extends string>(params: ObjectParamsV5<K & string, T>) => PluginParamEx<T, string & K>[];
export declare const convertStructSchema: <T extends PluginStructSchemaArray>(schema: T) => PluginStructType<object>;
export declare const convertPluginCommandSchema: <T extends PluginParam>(command: PluginCommandSchemaArrayFiltered<T>) => PluginCommandTypeEx<object>;
