import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compileAttributes } from "./attributes";
import type { BooleanParam } from "./params";
import type { PluginParamTokens } from "./parse";
import type { DeepJSONParserHandlers } from "./rmmzJSON/types/handlers";

const createHandlers = (): MockedObject<DeepJSONParserHandlers> => ({
  parseStringArray: vi.fn(),
  parseObject: vi.fn(),
  parseObjectArray: vi.fn(),
});

describe("compileAttributes - boolean", () => {
  test("minimum set", () => {
    const tokens: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "boolean",
        default: "true",
      } satisfies ParamSoruceRecord<BooleanParam>,
    };
    const mockHandlers = createHandlers();
    const result = compileAttributes(tokens, mockHandlers);
    const expected: BooleanParam = {
      default: true,
      kind: "boolean",
    };
    expect(result).toEqual(expected);
    expect(mockHandlers.parseStringArray).not.toHaveBeenCalled();
    expect(mockHandlers.parseObject).not.toHaveBeenCalled();
    expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
  });

  test("full set", () => {
    const tokens: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "boolean",
        default: "false",
        text: "Enabled?",
        desc: "Is this feature enabled?",
        on: "Yes",
        off: "No",
        parent: "Parent Feature",
      } satisfies ParamSoruceRecord<BooleanParam>,
    };
    const mockHandlers = createHandlers();
    const result = compileAttributes(tokens, mockHandlers);
    const expected: BooleanParam = {
      default: false,
      text: "Enabled?",
      desc: "Is this feature enabled?",
      on: "Yes",
      off: "No",
      parent: "Parent Feature",
      kind: "boolean",
    };
    expect(result).toEqual(expected);
    expect(mockHandlers.parseStringArray).not.toHaveBeenCalled();
    expect(mockHandlers.parseObject).not.toHaveBeenCalled();
    expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
  });
});
