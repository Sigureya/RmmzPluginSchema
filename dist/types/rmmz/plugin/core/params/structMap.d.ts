import { PluginArrayParamType, ClassifiedPluginParamsTyped, PluginParamEx2, PluginStructSchemaArray, PluginStructSchemaArrayFiltered, PrimitiveParam, PluginScalarParam, ParamKinds, PluginParamEx, StructPluginParam, PluginSchemaArray, PluginSchemaArrayFiltered, AnyStringParam, ComboParam, StringArrayParam, StringParam, StructRefParam, StructArrayRefParam } from './types';
import { StructCollection } from './types/structCollection';
export declare const createClassifiedStructMap: <S extends PluginScalarParam, A extends PluginArrayParamType>(bundle: PluginStructSchemaArrayFiltered<PluginParamEx2<S, A>>[]) => Map<string, ClassifiedPluginParamsTyped<S, A>>;
export declare const createStructMap: (structs: ReadonlyArray<PluginStructSchemaArray>) => Map<string, PrimitiveParam[]>;
export declare const collectStructsByKinds: (structs: ReadonlyArray<PluginStructSchemaArray>, kinds: ReadonlyArray<ParamKinds>) => StructCollection;
export declare const filterPluginSchemaStringParams: (schema: PluginSchemaArray) => PluginSchemaArrayFiltered<PluginParamEx<StructRefParam | StructArrayRefParam | (StringParam | StringArrayParam | ComboParam | AnyStringParam), string>>;
export declare function filterPluginSchemaByFn(schema: PluginSchemaArray, fn: (param: PrimitiveParam, name: string) => boolean): PluginSchemaArray;
export declare function filterPluginSchemaByFn<T extends PrimitiveParam>(schema: PluginSchemaArray, fn: (param: PrimitiveParam, name: string) => param is T): PluginSchemaArrayFiltered<PluginParamEx<T>>;
type StructFilterResult<T extends PrimitiveParam> = {
    structName: Set<string>;
    structs: PluginStructSchemaArrayFiltered<PluginParamEx<T> | StructPluginParam>[];
};
export declare function filterStructParamsByFn<T extends PrimitiveParam>(schema: ReadonlyArray<PluginStructSchemaArray>, fn: (param: PrimitiveParam, name: string) => param is T): StructFilterResult<T>;
export declare function filterStructParamsByFn(schema: ReadonlyArray<PluginStructSchemaArray>, fn: (param: PrimitiveParam, name: string) => boolean): StructFilterResult<PrimitiveParam>;
export {};
