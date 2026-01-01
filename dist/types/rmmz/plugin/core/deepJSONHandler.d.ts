import { ParamError } from './params/types/error';
import { DeepJSONParserHandlersEx } from './rmmzJSON/types/handlers';
export type DeepJSONParserHandlers = DeepJSONParserHandlersEx<ParamError>;
export declare const createDeepJSONParserHandlers: () => DeepJSONParserHandlers;
