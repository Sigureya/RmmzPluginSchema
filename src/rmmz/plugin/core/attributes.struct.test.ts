import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compilePluginParam } from "./attributes";
import type { DeepJSONParserHandlers } from "./deepJSONHandler";
import type { StructRefParam, StructArrayRefParam } from "./params";
import type { PluginParamTokens } from "./parse";
import { stringifyDeepJSON } from "./rmmzJSON";
import type { DeepParseResult } from "./rmmzJSON/types/handlers";

interface Person {
  name: string;
  age: number;
}
const mockStruct = {
  name: "",
  age: 0,
} as const satisfies Person;

type ObjectResult = DeepParseResult<Person, unknown>;

const createMockHandlers = (
  mockString: string[],
  mockedStruct: Person,
): MockedObject<DeepJSONParserHandlers> => ({
  parseStringArray: vi.fn().mockReturnValue({
    value: mockString,
    errors: [],
  }),
  parseObject: vi.fn().mockReturnValue({
    value: mockedStruct,
    errors: [],
  } satisfies ObjectResult),
  parseObjectArray: vi.fn().mockReturnValue({
    value: [mockedStruct],
    errors: [],
  }),
});

const errorName = "errorParam";

const createErrorMockHandlers = (
  errorTarget: string = errorName,
): MockedObject<DeepJSONParserHandlers> => ({
  parseStringArray: vi.fn((a, tokens) => {
    if (errorTarget === tokens.name) {
      throw new Error("String array parse error");
    }
    return {
      value: [],
      errors: [],
    };
  }),
  parseObject: vi.fn((a, tokens) => {
    if (errorTarget === tokens.name) {
      throw new Error("Object parse error");
    }
    return {
      value: {},
      errors: [],
    };
  }),
  parseObjectArray: vi.fn((a, tokens) => {
    if (errorTarget === tokens.name) {
      throw new Error("Object array parse error");
    }
    return {
      value: [],
      errors: [],
    };
  }),
});

describe("compileAttributes", () => {
  describe("struct ref", () => {
    test("normal case", () => {
      const expected: StructRefParam = {
        kind: "struct",
        struct: "Person",
        default: {
          name: "",
          age: 0,
        },
      };
      const defaultStr = stringifyDeepJSON(mockStruct);
      const tokens: PluginParamTokens = {
        name: "structParam",
        attr: {
          kind: "struct",
          struct: "Person",
          default: defaultStr,
        } satisfies ParamSoruceRecord<StructRefParam>,
      };
      const handlers = createMockHandlers([], mockStruct);
      const result = compilePluginParam(tokens, handlers);
      expect(result.name).toEqual("structParam");
      expect(result.attr).toEqual(expected);
      expect(handlers.parseStringArray).not.toHaveBeenCalled();
      expect(handlers.parseObject).toHaveBeenCalledWith(defaultStr, tokens);
      expect(handlers.parseObjectArray).not.toHaveBeenCalled();
    });
    test("object parse error", () => {
      const handlers = createErrorMockHandlers();
      const tokens: PluginParamTokens = {
        name: errorName,
        attr: {
          kind: "struct",
          struct: "Person",
          default: "{invalid json",
        },
      };
      expect(() => compilePluginParam(tokens, handlers)).toThrow(
        "Object parse error",
      );
      expect(handlers.parseObject).toHaveBeenCalledWith(
        tokens.attr.default,
        tokens,
      );
      expect(handlers.parseStringArray).not.toHaveBeenCalled();
      expect(handlers.parseObjectArray).not.toHaveBeenCalled();
    });
  });
  describe("struct array ref", () => {
    test("normal case", () => {
      const expected: StructArrayRefParam = {
        kind: "struct[]",
        struct: "MyStruct",
        default: [mockStruct],
      };
      const tokens: PluginParamTokens = {
        name: "structArrayParam",
        attr: {
          kind: "struct[]",
          struct: "MyStruct",
          default: "[]",
        } satisfies ParamSoruceRecord<StructArrayRefParam>,
      };
      const handlers = createMockHandlers([], mockStruct);
      const result = compilePluginParam(tokens, handlers);
      expect(result.name).toEqual("structArrayParam");
      expect(result.attr).toEqual(expected);
      expect(handlers.parseStringArray).not.toHaveBeenCalled();
      expect(handlers.parseObject).not.toHaveBeenCalled();
      expect(handlers.parseObjectArray).toHaveBeenCalledWith("[]", tokens);
    });
    test("object array parse error", () => {
      const handlers = createErrorMockHandlers();
      const tokens: PluginParamTokens = {
        name: errorName,
        attr: {
          kind: "struct[]",
          struct: "MyStruct",
          default: "[{invalid json",
        },
      };
      expect(() => compilePluginParam(tokens, handlers)).toThrow(
        "Object array parse error",
      );
      expect(handlers.parseObjectArray).toHaveBeenCalledWith(
        tokens.attr.default,
        tokens,
      );
      expect(handlers.parseStringArray).not.toHaveBeenCalled();
      expect(handlers.parseObject).not.toHaveBeenCalled();
    });
  });
});
