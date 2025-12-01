import { describe, test, expect, vi } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type {
  PluginValues,
  ParamExtractResult,
  PluginParamsSchema,
} from "./extractor/types";
import { compilePluginParamExtractor, extractPluginParam } from "./param";

interface Person {
  name: string;
  age: number;
}

const schemaPerson: ClassifiedPluginParamsEx<Person> = {
  scalars: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "age", attr: { kind: "number", default: 0 } },
  ],
  scalarArrays: [],
  structArrays: [],
  structs: [],
};

const pluginParamsSchema: PluginParamsSchema = {
  pluginName: "TestPlugin",
  schema: {
    params: [
      { name: "enable", attr: { kind: "boolean", default: false } },
      { name: "threshold", attr: { kind: "number", default: 10 } },
      { name: "person", attr: { kind: "struct", struct: "Person" } },
    ],
  },
};

const structMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map([
  ["Person", schemaPerson],
]);

const mockData = {
  enable: true,
  threshold: 42,
  person: {
    name: "Alice",
    age: 30,
  },
};

const createMockFn = () => vi.fn((path: string) => new JSONPathJS(path));

describe("plugin param extractor", () => {
  test("create memo", () => {
    const mockFn = createMockFn();
    compilePluginParamExtractor(pluginParamsSchema, structMap, mockFn);
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(mockFn).toHaveBeenNthCalledWith(1, "$.enable");
    expect(mockFn).toHaveBeenNthCalledWith(2, "$.threshold");
    expect(mockFn).toHaveBeenNthCalledWith(3, '$.person["name","age"]');
  });

  test("extract values", () => {
    const expected: PluginValues[] = [
      {
        category: "struct",
        name: "boolean",
        param: { name: "enable", attr: { kind: "boolean", default: false } },
        roootName: "plugin",
        rootType: "param",
        value: true,
      },
      {
        category: "struct",
        name: "number",
        param: { name: "threshold", attr: { kind: "number", default: 10 } },
        roootName: "plugin",
        rootType: "param",
        value: 42,
      },
      {
        category: "struct",
        name: "Person",
        param: { name: "name", attr: { kind: "string", default: "" } },
        roootName: "person",
        rootType: "param",
        value: "Alice",
      },
      {
        category: "struct",
        name: "Person",
        param: { name: "age", attr: { kind: "number", default: 0 } },
        roootName: "person",
        rootType: "param",
        value: 30,
      },
    ];
    const memo = compilePluginParamExtractor(
      pluginParamsSchema,
      structMap,
      (path) => new JSONPathJS(path)
    );
    const result: ParamExtractResult = extractPluginParam(mockData, memo);
    expect(result.pluginName).toBe("TestPlugin");
    expect(result.params).toEqual(expected);
  });
});
