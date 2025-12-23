import { describe, expect, test } from "vitest";
import { compileAttributes } from "./attributes";
import type {
  BooleanParam,
  NumberArrayParam,
  NumberParam,
  PrimitiveParam,
} from "./params";
import type { PluginParamTokens, PluginTokensRecord } from "./parse";

describe("compileAttributes", () => {
  const allTokens: PluginTokensRecord = {
    min: "0",
    max: "200",
    decimals: "2",
    on: "enable",
    off: "disable",
    dir: "img/pictures/",
    parent: "ppp",
    text: "Some Text",
    desc: "Some Description",
  };
  test("number", () => {
    const tokens: PluginParamTokens = {
      name: "num",
      attr: {
        ...allTokens,
        kind: "number",
        default: "123",
      },
    };

    const expected: NumberParam = {
      kind: "number",
      min: 0,
      max: 200,
      decimals: 2,
      default: 123,
      parent: "ppp",
      text: "Some Text",
      desc: "Some Description",
    };

    const result: PrimitiveParam = compileAttributes(tokens);
    expect(result).toEqual(expected);
  });
  test("number[]", () => {
    const tokens: PluginParamTokens = {
      name: "numArray",
      attr: {
        ...allTokens,
        kind: "number[]",
        default: "[10, 20, 30]",
      },
    };
    const expected: NumberArrayParam = {
      kind: "number[]",
      min: 0,
      max: 200,
      decimals: 2,
      default: [10, 20, 30],
      parent: "ppp",
      text: "Some Text",
      desc: "Some Description",
    };
    const result: PrimitiveParam = compileAttributes(tokens);
    expect(result).toEqual(expected);
  });
  test("boolean", () => {
    const tokens: PluginParamTokens = {
      name: "bool",
      attr: {
        ...allTokens,
        kind: "boolean",
        default: "true",
      },
    };
    const expected: BooleanParam = {
      kind: "boolean",
      on: "enable",
      off: "disable",
      default: true,
      parent: "ppp",
      text: "Some Text",
      desc: "Some Description",
    };
    const result: PrimitiveParam = compileAttributes(tokens);
    expect(result).toEqual(expected);
  });
});
