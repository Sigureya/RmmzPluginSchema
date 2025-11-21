import { PluginCommandSchemaArrayEx3, PluginCommandTypeEx, PluginParam, PluginParamEx, PluginStructSchemaArray, PluginStructType, PrimitiveParam, ObjectParamsV5, ScalarParam } from './types';
export declare function toObjectPluginParamsOld(params: ReadonlyArray<PluginParam>): Record<string, PrimitiveParam>;
export declare function toObjectPluginParams(params: ReadonlyArray<PluginParamEx<ScalarParam>>): Record<string, ScalarParam>;
export declare const toArrayPluginParam: <T extends PrimitiveParam, K extends string>(params: ObjectParamsV5<K & string, T>) => PluginParamEx<T, string & K>[];
export declare const convertStructSchema: <T extends PluginStructSchemaArray>(schema: T) => PluginStructType<object>;
export declare const convertPluginCommandSchema: <T extends PluginParam>(command: PluginCommandSchemaArrayEx3<T>) => PluginCommandTypeEx<object>;
