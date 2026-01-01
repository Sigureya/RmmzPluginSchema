import { DeepJSONParserHandlers } from './deepJSONHandler';
import { PrimitiveParam, PluginParam } from './params';
import { PluginParamTokens } from './parse';
export type ParamSoruceRecord<T> = Partial<Record<keyof T, string>>;
export declare const compilePluginParam: (tokens: PluginParamTokens, handlers: DeepJSONParserHandlers) => PluginParam;
/**
 * @deprecated Use `compilePluginParam` instead.
 */
export declare const compileAttributes: (tokens: PluginParamTokens, handlers: DeepJSONParserHandlers) => PrimitiveParam;
