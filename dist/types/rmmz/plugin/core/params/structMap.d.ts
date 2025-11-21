import { ClassifiedPluginParams, PluginStructSchemaArray, PrimitiveParam } from './types';
export declare const createClassifiedStructMap: (bundle: ReadonlyArray<PluginStructSchemaArray>) => Map<string, ClassifiedPluginParams>;
export declare const createStructMap: (structs: ReadonlyArray<PluginStructSchemaArray>) => Map<string, PrimitiveParam[]>;
