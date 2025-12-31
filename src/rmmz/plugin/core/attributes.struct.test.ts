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
  mockedStruct: Person
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

describe("compileAttributes", () => {
  test("struct ref", () => {
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
    expect(handlers.parseObject).toHaveBeenCalledWith(defaultStr);
    expect(handlers.parseObjectArray).not.toHaveBeenCalled();
  });
  test("struct array ref", () => {
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
    expect(handlers.parseObjectArray).toHaveBeenCalledWith("[]");
  });
});
