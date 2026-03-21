export interface DeepJSONParserHandlersEx<E, T = string> {
    parseStringArray: (json: string, context: T) => DeepParseResult<string[], E>;
    parseObject: (json: string, context: T) => DeepParseResult<object, E>;
    parseObjectArray: (json: string, context: T) => DeepParseResult<object[], E>;
}
export interface DeepParseResult<T, E> {
    value: T;
    errors: E[];
}
