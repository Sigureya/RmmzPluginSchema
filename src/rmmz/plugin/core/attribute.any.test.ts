import { describe, expect, test } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compileAttributes } from "./attributes";
import type { AnyStringParam } from "./params";
import type { PluginParamTokens } from "./parse/types/types";

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
    const result = compileAttributes(tokens);
    expect(result).toEqual(expected);
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
    const result = compileAttributes(tokens);
    expect(result).toEqual(expected);
  });
});
