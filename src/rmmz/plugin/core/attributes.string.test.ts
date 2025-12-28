import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compileAttributes } from "./attributes";
import type { StringParam, StringArrayParam } from "./params";
import type { PluginParamTokens } from "./parse";
import type { DeepJSONParserHandlers } from "./rmmzJSON/types/handlers";

const createHandlers = (): MockedObject<DeepJSONParserHandlers> => ({
  parseStringArray: vi.fn(),
  parseObject: vi.fn(),
  parseObjectArray: vi.fn(),
});

describe("compileAttributes", () => {
  describe("string", () => {
    test("minimum set", () => {
      const tokens: PluginParamTokens = {
        name: "attr",
        attr: {
          kind: "string",
          default: "abc",
        } satisfies ParamSoruceRecord<StringParam>,
      };
      const expected: StringParam = {
        kind: "string",
        default: "abc",
      };
      const mockHandlers = createHandlers();
      const result = compileAttributes(tokens, mockHandlers);
      expect(result).toEqual(expected);
      expect(mockHandlers.parseStringArray).not.toHaveBeenCalled();
      expect(mockHandlers.parseObject).not.toHaveBeenCalled();
      expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
    });

    test("full set", () => {
      const tokens: PluginParamTokens = {
        name: "attr",
        attr: {
          kind: "string",
          default: "abc",
          text: "String Text",
          desc: "String Description",
          parent: "Parent String",
        } satisfies ParamSoruceRecord<StringParam>,
      };
      const expected: StringParam = {
        kind: "string",
        default: "abc",
        text: "String Text",
        desc: "String Description",
        parent: "Parent String",
      };
      const mockHandlers = createHandlers();
      const result = compileAttributes(tokens, mockHandlers);
      expect(result).toEqual(expected);
      expect(mockHandlers.parseStringArray).not.toHaveBeenCalled();
      expect(mockHandlers.parseObject).not.toHaveBeenCalled();
      expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
    });
  });

  describe("string[]", () => {
    test("minimum set", () => {
      const tokens: PluginParamTokens = {
        name: "attr",
        attr: {
          kind: "string[]",
          default: `["a", "b", "c"]`,
        } satisfies ParamSoruceRecord<StringArrayParam>,
      };
      const expected: StringArrayParam = {
        kind: "string[]",
        default: ["a", "b", "c"],
      };

      const mockHandlers = createHandlers();

      const result = compileAttributes(tokens, mockHandlers);
      expect(result).toEqual(expected);
      expect(mockHandlers.parseStringArray).not.toHaveBeenCalled();
      expect(mockHandlers.parseObject).not.toHaveBeenCalled();
      expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
    });

    test("empty array", () => {
      const tokens: PluginParamTokens = {
        name: "attr",
        attr: {
          kind: "string[]",
          default: `[]`,
        } satisfies ParamSoruceRecord<StringArrayParam>,
      };
      const expected: StringArrayParam = {
        kind: "string[]",
        default: [],
      };
      const mockHandlers = createHandlers();

      const result = compileAttributes(tokens, mockHandlers);
      expect(result).toEqual(expected);
      expect(mockHandlers.parseStringArray).not.toHaveBeenCalled();
      expect(mockHandlers.parseObject).not.toHaveBeenCalled();
      expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
    });
  });
});
