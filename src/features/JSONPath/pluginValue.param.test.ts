import { describe, expect, test } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginParam,
  PluginParamsRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import { stringifyDeepJSON } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type { PluginValuesPath } from "./core";
import {
  compilePluginParamExtractor,
  createPluginValuesPath,
  extractPluginParamFromRecord,
  type ParamExtractResult,
  type PluginParamsSchema,
} from "./core";

interface Item {
  name: string;
  id: number;
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

const structsMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map([
  ["Item", schemaItem],
]);

const itemParam: PluginParam = {
  name: "items",
  attr: { kind: "struct[]", struct: "Item" },
};

const pluginSchema: PluginParamsSchema = {
  pluginName: "MockPlugin",
  schema: {
    params: [itemParam],
  },
};

const record: PluginParamsRecord = {
  name: "MockPlugin",
  status: true,
  description: "integration test",
  parameters: {
    items: stringifyDeepJSON([
      { name: "Potion", id: 1 },
      { name: "Hi-Potion", id: 2 },
    ]),
  },
};

describe("plugin param integration", () => {
  const path: PluginValuesPath = {
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
  };

  test("パスを適切に構築できるか", () => {
    const pathResult = createPluginValuesPath(
      "param",
      "MockPluginParams",
      itemParam,
      structsMap,
    );

    expect(pathResult).toEqual(path);
  });

  test("値の取り出しは成功したか", () => {
    const expected: ParamExtractResult = {
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
    };

    const memo = compilePluginParamExtractor(
      pluginSchema,
      structsMap,
      (jsonPath) => new JSONPathJS(jsonPath),
    );

    const result = extractPluginParamFromRecord(record, memo.extractors);
    expect(result).toEqual(expected);
  });
});
