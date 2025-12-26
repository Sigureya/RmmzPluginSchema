import { describe, expect, test, vi } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compileAttributes } from "./attributes";
import type { StructRefParam, StructArrayRefParam } from "./params";
import type { PluginParamTokens } from "./parse";
import { parseDeepJSON, stringifyDeepJSON } from "./rmmzJSON";

interface Person {
  name: string;
  age: number;
}
const mockStruct = {
  name: "",
  age: 0,
} as const satisfies Person;

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
    const fn = vi.fn((text: string) => parseDeepJSON(text));
    const result = compileAttributes(tokens, fn);
    expect(result).toEqual(expected);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(defaultStr);
  });
  test("struct array ref", () => {
    const expected: StructArrayRefParam = {
      kind: "struct[]",
      struct: "MyStruct",
      default: [],
    };
    const tokens: PluginParamTokens = {
      name: "structArrayParam",
      attr: {
        kind: "struct[]",
        struct: "MyStruct",
        default: "[]",
      } satisfies ParamSoruceRecord<StructArrayRefParam>,
    };
    const fn = vi.fn((text: string) => parseDeepJSON(text));
    const result = compileAttributes(tokens, fn);
    expect(result).toEqual(expected);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("[]");
  });
});
