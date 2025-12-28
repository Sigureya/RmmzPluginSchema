import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compileAttributes } from "./attributes";
import type { AnyStringParam } from "./params";
import type { PluginParamTokens } from "./parse/types/types";
import type { DeepJSONParserHandlers } from "./rmmzJSON/types/handlers";

const createHandlers = (): MockedObject<DeepJSONParserHandlers> => ({
  parseStringArray: vi.fn(),
  parseObject: vi.fn(),
  parseObjectArray: vi.fn(),
});

describe("compileAttributes - any", () => {
  test("no kind", () => {
    const tokens: PluginParamTokens = {
      name: "anyParam",
      attr: {
        // No kind specified
      } satisfies ParamSoruceRecord<unknown>,
    };
    const expected: AnyStringParam = {
      kind: "any",
      default: "",
    };
    const mockHandlers = createHandlers();
    const result = compileAttributes(tokens, mockHandlers);
    expect(result).toEqual(expected);
    expect(mockHandlers.parseStringArray).not.toHaveBeenCalled();
    expect(mockHandlers.parseObject).not.toHaveBeenCalled();
    expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
  });
  test("unknown kind", () => {
    const tokens: PluginParamTokens = {
      name: "anyParam",
      attr: {
        kind: "unknownKind",
      } satisfies ParamSoruceRecord<unknown>,
    };
    const expected: AnyStringParam = {
      kind: "any",
      default: "",
    };
    const mockHandlers = createHandlers();
    const result = compileAttributes(tokens, mockHandlers);
    expect(result).toEqual(expected);
    expect(mockHandlers.parseStringArray).not.toHaveBeenCalled();
    expect(mockHandlers.parseObject).not.toHaveBeenCalled();
    expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
  });
});
