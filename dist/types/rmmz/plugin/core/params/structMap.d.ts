import { PluginArrayParamType, ClassifiedPluginParamsEx2, PluginParamEx2, PluginStructSchemaArray, PluginStructSchemaArrayFiltered, PrimitiveParam, PluginScalarParam } from './types';
export declare const createClassifiedStructMap: <S extends PluginScalarParam, A extends PluginArrayParamType>(bundle: PluginStructSchemaArrayFiltered<PluginParamEx2<S, A>>[]) => Map<string, ClassifiedPluginParamsEx2<S, A>>;
export declare const createStructMap: (structs: ReadonlyArray<PluginStructSchemaArray>) => Map<string, PrimitiveParam[]>;
