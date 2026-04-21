import { describe, expect, test } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginParam,
  PluginParamsRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import { stringifyDeepJSON } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type {
  PluginValuesPath,
  ParamExtractResult,
  PluginParamsSchema,
} from "./core";
import {
  compilePluginParamExtractor,
  createPluginValuesPath,
  extractPluginParamFromRecord,
} from "./core";

interface Item {
  name: string;
  id: number;
}

interface Class {
  name: string;
  maxLevel: number;
  expTable: number[];
}

const schemaItem: ClassifiedPluginParamsEx<Item> = {
  scalars: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "id", attr: { kind: "number", default: 0 } },
  ],
  scalarArrays: [],
  structArrays: [],
  structs: [],
};

const schemaClass: ClassifiedPluginParamsEx<Class> = {
  scalars: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "maxLevel", attr: { kind: "number", default: 0 } },
  ],
  scalarArrays: [{ name: "expTable", attr: { kind: "number[]", default: [] } }],
  structArrays: [],
  structs: [],
};

const structsMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map<
  string,
  ClassifiedPluginParams
>([
  ["Item", schemaItem],
  ["Class", schemaClass],
]);

const itemParam: PluginParam = {
  name: "items",
  attr: { kind: "struct[]", struct: "Item" },
};

const classParam: PluginParam = {
  name: "class",
  attr: { kind: "struct", struct: "Class" },
};

interface TestCase {
  caseName: string;
  path: PluginValuesPath;
  expected: ParamExtractResult;
  paramSchema: PluginParam;
}

const runTestCase = (testCase: TestCase, record2: PluginParamsRecord) => {
  describe(testCase.caseName, () => {
    const pluginSchema: PluginParamsSchema = {
      pluginName: "MockPlugin",
      schema: {
        params: [testCase.paramSchema],
      },
    };

    test("パスを適切に構築できるか", () => {
      const pathResult = createPluginValuesPath(
        "param",
        "MockPluginParams",
        testCase.paramSchema,
        structsMap,
      );

      expect(pathResult).toEqual(testCase.path);
    });

    test("値の取り出しは成功したか", () => {
      const memo = compilePluginParamExtractor(
        pluginSchema,
        structsMap,
        (jsonPath) => new JSONPathJS(jsonPath),
      );

      const result = extractPluginParamFromRecord(record2, memo.extractors);
      expect(result).toEqual(testCase.expected);
    });
  });
};

const testCases: TestCase[] = [
  {
    paramSchema: itemParam,
    caseName: "基本的な構造のテスト",
    path: {
      rootCategory: "param",
      rootName: "items",
      scalars: undefined,
      structArrays: {
        errors: [],
        items: [
          {
            category: "struct",
            name: "Item",
            objectSchema: {
              id: { kind: "number", default: 0 },
              name: { kind: "string", default: "" },
            },
            scalarArrays: [],
            scalarsPath: '$["items"][*]["name","id"]',
          },
        ],
      },
      structs: { errors: [], items: [] },
    },
    expected: {
      pluginName: "MockPlugin",
      params: [
        {
          rootType: "param",
          rootName: "items",
          structName: "Item",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Potion",
        },
        {
          rootType: "param",
          rootName: "items",
          structName: "Item",
          param: { name: "id", attr: { kind: "number", default: 0 } },
          value: 1,
        },
        {
          rootType: "param",
          rootName: "items",
          structName: "Item",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Hi-Potion",
        },
        {
          rootType: "param",
          rootName: "items",
          structName: "Item",
          param: { name: "id", attr: { kind: "number", default: 0 } },
          value: 2,
        },
      ],
    },
  },
  {
    paramSchema: classParam,
    caseName: "Class構造体と配列のテスト",
    path: {
      rootCategory: "param",
      rootName: "class",
      scalars: undefined,
      structArrays: { errors: [], items: [] },
      structs: {
        errors: [],
        items: [
          {
            category: "struct",
            name: "Class",
            objectSchema: {
              name: { kind: "string", default: "" },
              maxLevel: { kind: "number", default: 0 },
            },
            scalarArrays: [
              {
                param: {
                  name: "expTable",
                  attr: { kind: "number[]", default: [] },
                },
                path: '$["class"]["expTable"][*]',
              },
            ],
            scalarsPath: '$["class"]["name","maxLevel"]',
          },
        ],
      },
    },
    expected: {
      pluginName: "MockPlugin",
      params: [
        {
          rootType: "param",
          rootName: "class",
          structName: "Class",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Warrior",
        },
        {
          rootType: "param",
          rootName: "class",
          structName: "Class",
          param: { name: "maxLevel", attr: { kind: "number", default: 0 } },
          value: 99,
        },
        {
          rootType: "param",
          rootName: "class",
          structName: "Class",
          param: {
            name: "expTable",
            attr: { kind: "number[]", default: [] },
          },
          value: 0,
        },
        {
          rootType: "param",
          rootName: "class",
          structName: "Class",
          param: {
            name: "expTable",
            attr: { kind: "number[]", default: [] },
          },
          value: 100,
        },
        {
          rootType: "param",
          rootName: "class",
          structName: "Class",
          param: {
            name: "expTable",
            attr: { kind: "number[]", default: [] },
          },
          value: 300,
        },
      ],
    },
  },
];
describe("PluginParamExtractorのテスト", () => {
  const record: PluginParamsRecord = {
    name: "MockPlugin",
    status: true,
    description: "integration test",
    parameters: {
      items: stringifyDeepJSON([
        { name: "Potion", id: 1 },
        { name: "Hi-Potion", id: 2 },
      ]),
      class: stringifyDeepJSON({
        name: "Warrior",
        maxLevel: 99,
        expTable: [0, 100, 300],
      }),
      num: "123",
    },
  };
  testCases.forEach((testCase) => runTestCase(testCase, record));
});
