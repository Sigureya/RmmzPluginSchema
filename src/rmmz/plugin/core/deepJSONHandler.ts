import { parseDeepJSON } from "./rmmzJSON";
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
  parseObject: (json: string) => {
    return {
      value: parseDeepJSON(json) as object,
      errors: [],
    };
  },
});
