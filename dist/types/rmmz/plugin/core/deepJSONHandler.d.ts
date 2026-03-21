import { ParamError } from './params/types/error';
import { PluginParamTokens } from './parse';
import { DeepJSONParserHandlersEx } from './rmmzJSON/types/handlers';
export type DeepJSONParserHandlers = DeepJSONParserHandlersEx<ParamError, PluginParamTokens>;
export declare const createDeepJSONParserHandlers: () => DeepJSONParserHandlers;
