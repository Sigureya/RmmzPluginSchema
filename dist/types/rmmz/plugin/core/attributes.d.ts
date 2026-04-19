import { DeepJSONParserHandlers } from './deepJSONHandler';
import { PluginParam } from './params';
import { PluginParamTokens } from './parse';
import { AttrMessage } from './types/attrMessage';
export type ParamSoruceRecord<T> = Partial<Record<keyof T, string>>;
export declare const compilePluginParam: (tokens: PluginParamTokens, handlers: DeepJSONParserHandlers, message?: AttrMessage) => PluginParam;
