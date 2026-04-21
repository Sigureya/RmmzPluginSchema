import { PluginArrayParamType, ClassifiedPluginParamsTyped, PluginParamEx2, PluginStructSchemaArray, PluginStructSchemaArrayFiltered, PrimitiveParam, PluginScalarParam } from './types';
export declare const createClassifiedStructMap: <S extends PluginScalarParam, A extends PluginArrayParamType>(bundle: PluginStructSchemaArrayFiltered<PluginParamEx2<S, A>>[]) => Map<string, ClassifiedPluginParamsTyped<S, A>>;
export declare const createStructMap: (structs: ReadonlyArray<PluginStructSchemaArray>) => Map<string, PrimitiveParam[]>;
