import { describe, expect, test } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compileAttributes } from "./attributes";
import type { StructRefParam, StructArrayRefParam } from "./params";
import type { PluginParamTokens } from "./parse";
import { stringifyDeepJSON } from "./rmmzJSON";

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
    const tokens: PluginParamTokens = {
      name: "structParam",
      attr: {
        kind: "struct",
        struct: "Person",
        default: stringifyDeepJSON(mockStruct),
      } satisfies ParamSoruceRecord<StructRefParam>,
    };
    const result = compileAttributes(tokens);
    expect(result).toEqual(expected);
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
      } satisfies ParamSoruceRecord<StructArrayRefParam>,
    };
    const result = compileAttributes(tokens);
    expect(result).toEqual(expected);
  });
});
