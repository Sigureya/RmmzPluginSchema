import { describe, expect, test } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compileAttributes } from "./attributes";
import type { RpgDataIdParam, PrimitiveParam } from "./params";
import type { PluginParamTokens } from "./parse";

describe("compileAttributes - dataId", () => {
  test("enemy", () => {
    const mock: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "enemy",
        default: "0",
      } satisfies ParamSoruceRecord<RpgDataIdParam>,
    };
    const expected: PrimitiveParam = {
      kind: "enemy",
      default: 0,
    };
    const result = compileAttributes(mock);
    expect(result).toEqual(expected);
  });
});
