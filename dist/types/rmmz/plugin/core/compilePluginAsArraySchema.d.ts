import { DeepJSONParserHandlers } from './deepJSONHandler';
import { PluginSchemaArray } from './params';
import { PluginTokens } from './parse/types';
export type CCC = "command" | "param" | "struct";
export declare const compilePluginAsArraySchema: (parsedPlugin: PluginTokens, parser?: DeepJSONParserHandlers) => PluginSchemaArray;
