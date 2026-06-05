import { PluginArrayParamType, ClassifiedPluginParamsTyped, PluginParamEx2, PluginStructSchemaArray, PluginStructSchemaArrayFiltered, PrimitiveParam, PluginScalarParam, ParamKinds, PluginSchemaArray } from './types';
import { StructCollection } from './types/structCollection';
export declare const createClassifiedStructMap: <S extends PluginScalarParam, A extends PluginArrayParamType>(bundle: PluginStructSchemaArrayFiltered<PluginParamEx2<S, A>>[]) => Map<string, ClassifiedPluginParamsTyped<S, A>>;
export declare const createStructMap: (structs: ReadonlyArray<PluginStructSchemaArray>) => Map<string, PrimitiveParam[]>;
export declare const collectStructsByKinds: (structs: ReadonlyArray<PluginStructSchemaArray>, kinds: ReadonlyArray<ParamKinds>) => StructCollection;
export declare const filterPluginSchemaByFn: (schema: PluginSchemaArray, fn: (param: PrimitiveParam, name: string) => boolean) => PluginSchemaArray;
export declare function filterStructParamsByFn(schema: ReadonlyArray<PluginStructSchemaArray>, fn: (param: PrimitiveParam, name: string) => boolean): {
    structName: Set<string>;
    structs: PluginStructSchemaArray[];
};
