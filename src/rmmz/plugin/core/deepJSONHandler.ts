import type { ParamError } from "./params/types/error";
import type { PluginParamTokens } from "./parse";
import { parseDeepJSON } from "./rmmzJSON";
import type { DeepJSONParserHandlersEx } from "./rmmzJSON/types/handlers";

export type DeepJSONParserHandlers = DeepJSONParserHandlersEx<
  ParamError,
  PluginParamTokens
>;

export const createDeepJSONParserHandlers = (): DeepJSONParserHandlers => ({
  parseStringArray: (json: string) => {
    const value = parseStringArray(json);
    return {
      value: value,
      errors: [],
    };
  },
  parseObjectArray: () => {
    return {
      value: [],
      errors: [],
    };
  },
  parseObject: (json: string) => {
    return {
      value: parseDeepJSON(json) as object,
      errors: [],
    };
  },
});

const parseStringArray = (value: string): string[] => {
  try {
    const array = JSON.parse(value);
    if (
      Array.isArray(array) &&
      array.every((item) => typeof item === "string")
    ) {
      return array;
    }
  } catch {}
  return [];
};
