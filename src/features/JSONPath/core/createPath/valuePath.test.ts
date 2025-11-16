import { describe, test, expect } from "vitest";
import type { PluginParamEx, ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type {
  PluginValuesPathNewVersion,
  PrimitivePluginValuesPath,
} from "./types";
import { eee } from "./valuePath";

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
    const result: PluginValuesPathNewVersion = eee("param", "testParam", param);
    expect(result).toEqual(expected);
  });
});
