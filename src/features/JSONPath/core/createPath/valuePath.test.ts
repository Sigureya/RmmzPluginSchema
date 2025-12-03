import { describe, test, expect } from "vitest";
import type { NumberParam, PluginParamEx } from "@RmmzPluginSchema/rmmz/plugin";
import type { PrimitivePluginValuesPath } from "./types";
import { createPrimiteveParamPath } from "./valuePath";

describe("eee", () => {
  const param: PluginParamEx<NumberParam> = {
    name: "testParam",
    attr: { kind: "number", default: 0 },
  };
  test("primitive param", () => {
    type ResultType = PrimitivePluginValuesPath<NumberParam>;
    const expected: ResultType = {
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
    const result: ResultType = createPrimiteveParamPath(
      "param",
      "testParam",
      param
    );
    expect(result).toEqual(expected);
  });
});
