import type { DeepJSONParserHandlers } from "./rmmzJSON/types/handlers";

export const createDeepJSONParserHandlers = (): DeepJSONParserHandlers => ({
  parseStringArray: () => {
    return {
      value: [],
      errors: [],
    };
  },
  parseObjectArray: () => {
    return {
      value: [],
      errors: [],
    };
  },
  parseObject: () => {
    return {
      value: {},
      errors: [],
    };
  },
});
