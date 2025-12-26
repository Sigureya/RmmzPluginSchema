import { PluginSchemaArray } from './params';
import { PluginTokens } from './parse/types';
export type CCC = "command" | "param" | "struct";
export declare const compilePluginAsArraySchema: (parsedPlugin: PluginTokens, fn?: (structDefault: string, category: CCC) => unknown) => PluginSchemaArray;
