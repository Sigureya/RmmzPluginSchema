import { PluginCommandPathMap, PluginReplacePathData } from './features';
import { DeepJSONValue, PluginParamsObject, PluginParamsRecord, PluginTextSchema } from './rmmz';
export interface PluginManifestData extends PluginReplacePathData {
    pluginName: string;
    desc: string;
    params: Record<string, DeepJSONValue>;
}
export declare const createManifestData: (plugin: PluginParamsObject, schema: PluginTextSchema, hashFn: (str: string) => string) => PluginManifestData;
export declare const buildRuntimeData: (data: PluginManifestData, dictionryFn: (hash: string) => string | undefined) => PluginParamsRecord;
export declare const createPluginCommandMapFromManifestData: (data: ReadonlyArray<PluginManifestData>) => PluginCommandPathMap;
