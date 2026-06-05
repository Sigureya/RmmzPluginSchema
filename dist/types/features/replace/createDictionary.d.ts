import { AnyStringParam, PluginSchema, PluginSchemaArray } from '../../rmmz/plugin';
import { PluginReplacePath } from './types';
export declare const createTextParamDictionary: ({ schema, pluginName }: Pick<PluginSchema, "schema" | "pluginName">, anyFn: (anyParam: AnyStringParam, name: string) => boolean) => PluginReplacePath;
export declare const createDictionary: (pluginName: string, schema: PluginSchemaArray) => PluginReplacePath;
