import { describe, expect, test, vi } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compileAttributes } from "./attributes";
import type { StringParam, StringArrayParam } from "./params";
import type { PluginParamTokens } from "./parse";

describe("compileAttributes - string", () => {
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
    const fn = vi.fn(() => {});
    const result = compileAttributes(tokens, fn);
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
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
    const fn = vi.fn(() => {});
    const result = compileAttributes(tokens, fn);
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
  });
});

describe("compileAttributes - string[]", () => {
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
    const fn = vi.fn(() => {});

    const result = compileAttributes(tokens, fn);
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
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
    const fn = vi.fn(() => {});
    const result = compileAttributes(tokens, fn);
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
  });
});
