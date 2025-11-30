import { describe, test, expect } from "vitest";
import type { PluginParamEx, ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesPathBase, PrimitivePluginValuesPath } from "./types";
import { createPrimiteveParamPath } from "./valuePath";

describe("eee", () => {
  const param: PluginParamEx<ScalarParam> = {
    name: "testParam",
    attr: { kind: "number", default: 0 },
  };
  test("primitive param", () => {
    const expected: PrimitivePluginValuesPath = {
      rootCategory: "param",
      rootName: "testParam",
      scalars: {
        category: "primitive",
        name: "number",
        objectSchema: {
          testParam: { kind: "number", default: 0 },
        },
        scalarsPath: "$.testParam",
        scalarArrays: [],
      },
      structArrays: {
        items: [],
        errors: [],
      },
      structs: {
        items: [],
        errors: [],
      },
    };
    const result: PluginValuesPathBase = createPrimiteveParamPath(
      "param",
      "testParam",
      param
    );
    expect(result).toEqual(expected);
  });
});
