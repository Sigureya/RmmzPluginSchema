import { describe, test, expect, vi } from "vitest";
import type { BooleanParam, NumberParam } from "@RmmzPluginSchema/rmmz/plugin";
import {
  stringifyDeepJSON,
  type ClassifiedPluginParams,
  type ClassifiedPluginParamsEx,
  type PluginParamsRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type {
  PluginValues,
  ParamExtractResult,
  PluginParamsSchema,
  PluginParamExtractor,
} from "./extractor/types";
import {
  compilePluginParamExtractor,
  extractPluginParam,
  extractPluginParamFromRecord,
} from "./param";

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

const pluginParamsSchema: PluginParamsSchema<
  NumberParam | BooleanParam,
  never
> = {
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
  dummy: "ignore me",
};

const createMockFn = () => vi.fn((path: string) => new JSONPathJS(path));

const createMockParam = (): Record<string, string> => {
  const e2: [string, string][] = Object.entries(mockData).map(
    ([key, value]): [string, string] => [key, stringifyDeepJSON(value)]
  );
  return Object.fromEntries(e2);
};

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
        structName: "",
        param: { name: "enable", attr: { kind: "boolean", default: false } },
        rootName: "plugin",
        rootType: "param",
        value: true,
      },
      {
        structName: "",
        param: { name: "threshold", attr: { kind: "number", default: 10 } },
        rootName: "plugin",
        rootType: "param",
        value: 42,
      },
      {
        structName: "Person",
        param: { name: "name", attr: { kind: "string", default: "" } },
        rootName: "person",
        rootType: "param",
        value: "Alice",
      },
      {
        structName: "Person",
        param: { name: "age", attr: { kind: "number", default: 0 } },
        rootName: "person",
        rootType: "param",
        value: 30,
      },
    ];
    const memo: PluginParamExtractor = compilePluginParamExtractor(
      pluginParamsSchema,
      structMap,
      (path) => new JSONPathJS(path)
    );
    const result: ParamExtractResult = extractPluginParam(mockData, memo);
    expect(result.pluginName).toBe("TestPlugin");
    expect(result.params).toEqual(expected);
  });
  test("extract from record", () => {
    const expected: PluginValues[] = [
      {
        structName: "Person",
        param: {
          attr: {
            default: "",
            kind: "string",
          },
          name: "name",
        },
        rootName: "person",
        rootType: "param",
        value: "Alice",
      },
      {
        structName: "Person",
        param: {
          attr: {
            default: 0,
            kind: "number",
          },
          name: "age",
        },
        rootName: "person",
        rootType: "param",
        value: 30,
      },
    ];

    const memo: PluginParamExtractor = compilePluginParamExtractor(
      pluginParamsSchema,
      structMap,
      (path) => new JSONPathJS(path)
    );

    const record: PluginParamsRecord = {
      name: "TestPlugin",
      parameters: createMockParam(),
      status: true,
      description: "Test plugin for param extraction",
    };
    const result: ParamExtractResult = extractPluginParamFromRecord(
      record,
      memo.extractors
    );
    expect(result.pluginName).toBe("TestPlugin");
    expect(result.params).toEqual(expected);
  });
});
