export interface DeepJSONParserHandlersEx<E> {
  parseStringArray: (json: string) => DeepParseResult<string[], E>;
  parseObject: (json: string) => DeepParseResult<object, E>;
  parseObjectArray: (json: string) => DeepParseResult<object[], E>;
}

export interface DeepParseResult<T, E> {
  value: T;
  errors: E[];
}
