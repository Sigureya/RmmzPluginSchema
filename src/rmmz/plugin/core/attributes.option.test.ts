import { describe, test, expect, vi } from "vitest";
import { compileAttributes, type ParamSoruceRecord } from "./attributes";
import type { ComboParam, SelectParam } from "./params";
import type { PluginParamTokens } from "./parse";

describe("compileAttributes - combo", () => {
  test("empty options", () => {
    const token: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "combo",
        default: "option1",
        text: "a combo",
        desc: "this is a combo",
        parent: "parentId",
      } satisfies ParamSoruceRecord<ComboParam>,
    };
    const expected: ComboParam = {
      kind: "combo",
      default: "option1",
      options: [],
      text: "a combo",
      desc: "this is a combo",
      parent: "parentId",
    };
    const fn = vi.fn(() => {});
    const result = compileAttributes(token, fn);
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
  });
  test("with options", () => {
    const token: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "combo",
        default: "option1",
        text: "a combo",
        desc: "this is a combo",
        parent: "parentId",
      } satisfies ParamSoruceRecord<ComboParam>,
      options: [
        { option: "a", value: "option1" },
        { option: "b", value: "option2" },
      ],
    };
    const expected: ComboParam = {
      kind: "combo",
      default: "option1",
      options: ["a", "b"],
      text: "a combo",
      desc: "this is a combo",
      parent: "parentId",
    };
    const fn = vi.fn(() => {});
    const result = compileAttributes(token, fn);
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
  });
});

describe("compileAttributes - select", () => {
  test("empty options", () => {
    const token: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "select",
        default: "option1",
        text: "a select",
        desc: "this is a select",
        parent: "parentId",
      } satisfies ParamSoruceRecord<SelectParam>,
    };

    const expected: SelectParam = {
      kind: "select",
      default: "option1",
      options: [],
      text: "a select",
      desc: "this is a select",
      parent: "parentId",
    };
    const fn = vi.fn(() => {});
    const result = compileAttributes(token, fn);
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
  });
  test("with options", () => {
    const token: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "select",
        default: "option1",
        text: "a select",
        desc: "this is a select",
        parent: "parentId",
      } satisfies ParamSoruceRecord<SelectParam>,
      options: [
        { option: "hayate", value: "E2" },
        { option: "komachi", value: "E3" },
      ],
    };

    const expected: SelectParam = {
      kind: "select",
      default: "option1",
      options: [
        { option: "hayate", value: "E2" },
        { option: "komachi", value: "E3" },
      ],
      text: "a select",
      desc: "this is a select",
      parent: "parentId",
    };
    const fn = vi.fn(() => {});
    const result = compileAttributes(token, fn);
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
  });
});
