import type { MockedObject } from "vitest";
import { describe, test, expect, vi } from "vitest";
import type {
  PluginArrayParamType,
  ClassifiedPluginParamsEx2,
  NumberArrayParam,
  NumberParam,
  PluginParamEx,
  PluginScalarParam,
  StringParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PrimitivePluginValuesPath } from "./types";
import { createPrimiteveParamPath, createPluginValuesPath } from "./valuePath";

const createMockedMap = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(): MockedObject<ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>> => {
  const map = new Map<string, ClassifiedPluginParamsEx2<S, A>>();
  return {
    get: vi.fn((k) => map.get(k)),
    entries: vi.fn(() => map.entries()),
    forEach: vi.fn((cb) => map.forEach(cb)),
    has: vi.fn((k) => map.has(k)),
    size: map.size,
    keys: vi.fn(() => map.keys()),
    values: vi.fn(() => map.values()),
    [Symbol.iterator]: vi.fn(() => map[Symbol.iterator]()),
  };
};

describe("eee", () => {
  describe("", () => {
    const param: PluginParamEx<NumberParam> = {
      name: "testParam",
      attr: { kind: "number", default: 0 },
    };
    type ResultType = PrimitivePluginValuesPath<NumberParam>;
    const expected: ResultType = {
      rootCategory: "param",
      rootName: "testParam",
      scalars: {
        name: "number",
        objectSchema: {
          testParam: { kind: "number", default: 0 },
        },
        scalarsPath: `$["testParam"]`,
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
    test("number param", () => {
      const result: ResultType = createPrimiteveParamPath(
        "param",
        "testParam",
        param
      );
      expect(result).toEqual(expected);
    });
    test("number param via createPluginValuesPath", () => {
      const structMap = createMockedMap<NumberParam, NumberArrayParam>();
      const result = createPluginValuesPath(
        "param",
        "testParam",
        param,
        structMap
      );
      expect(result).toEqual(expected);
      expect(structMap.get).not.toHaveBeenCalled();
    });
  });
  describe("createPrimiteveParamPath with string param", () => {
    const param: PluginParamEx<StringParam> = {
      name: "stringParam",
      attr: { kind: "string", default: "" },
    };
    type ResultType = PrimitivePluginValuesPath<StringParam>;
    const expected: ResultType = {
      rootCategory: "args",
      rootName: "stringParam",
      scalars: {
        name: "string",
        objectSchema: {
          stringParam: { kind: "string", default: "" },
        },
        scalarsPath: `$["stringParam"]`,
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
    test("string param", () => {
      const result: ResultType = createPrimiteveParamPath(
        "args",
        "stringParam",
        param
      );
      expect(result).toEqual(expected);
    });
  });
});
