import type { ParamError } from "../../params/types/error";

export interface DeepJSONParserHandlers<E = ParamError> {
  parseStringArray: (json: string) => DeepParseResult<string[], E>;
  parseObject: (json: string) => DeepParseResult<object, E>;
  parseObjectArray: (json: string) => DeepParseResult<object[], E>;
}

export interface DeepParseResult<T, E> {
  value: T;
  errors: E[];
}
