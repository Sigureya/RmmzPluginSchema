import { describe, expect, test, vi } from "vitest";
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
    const fn = vi.fn(() => {});
    const result = compileAttributes(mock, fn);
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
  });
});
