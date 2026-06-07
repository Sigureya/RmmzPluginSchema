import { AnyStringParam, PluginSchema, PluginSchemaArray } from '../../rmmz/plugin';
import { PluginReplacePathData } from './types';
export declare const createTextParamDictionary: ({ schema, pluginName }: Pick<PluginSchema, "schema" | "pluginName">, anyFn: (anyParam: AnyStringParam, name: string) => boolean) => PluginReplacePathData;
export declare const createPluginParamDictionary: (pluginName: string, schema: PluginSchemaArray) => PluginReplacePathData;
