export interface DeepJSONParserHandlers {
  parseStringArray: (json: string) => string[];
  parseObject: (json: string) => Record<string, unknown>;
  parseObjectArray: (json: string) => Record<string, unknown>[];
}
