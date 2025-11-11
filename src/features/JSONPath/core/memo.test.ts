import { describe, test, expect } from "vitest";
import type { PluginValuesPath } from "./createPath/types/pathSchemaTypes";
import { buildPluginValuesPathSchemaV3, collectPluginValues } from "./memo";
import type { PluginValues } from "./memo2/types";

interface MockData {
  items: number[];
  name: string;
  age: number;
}

const mockData = {
  items: [1, 2, 3],
  name: "Alice",
  age: 20,
} as const satisfies MockData;

describe("buildPluginValuesPathSchemaV3", () => {
  describe("", () => {
    const command: PluginValuesPath = {
      scalars: {
        category: "struct",
        name: "Empty",
        scalars: undefined,
        scalarArrays: [],
        objectSchema: {},
      },
      structArrays: { items: [], errors: [] },
      structs: { items: [], errors: [] },
    };
    test("", () => {
      const result = buildPluginValuesPathSchemaV3(command);
      expect(result).toEqual([]);
    });
    test("", () => {
      const collected = collectPluginValues(mockData, []);
      expect(collected).toEqual([]);
    });
  });
  describe("", () => {
    const command: PluginValuesPath = {
      scalars: {
        category: "struct",
        name: "Person",
        scalars: `$["name","age"]`,
        scalarArrays: [],
        objectSchema: {
          name: { default: "", kind: "string" },
          age: { default: 0, kind: "number" },
        },
      },
      structArrays: { items: [], errors: [] },
      structs: { items: [], errors: [] },
    };
    test("", () => {
      const result = buildPluginValuesPathSchemaV3(command);
      expect(result).lengthOf(1);
    });
    test("", () => {
      const expected: PluginValues[] = [
        {
          value: "Alice",
          category: "struct",
          name: "Person",
          param: { name: "name", attr: { default: "", kind: "string" } },
        },
        {
          value: 20,
          category: "struct",
          name: "Person",
          param: { name: "age", attr: { default: 0, kind: "number" } },
        },
      ];
      const result = buildPluginValuesPathSchemaV3(command);
      const collected = collectPluginValues(mockData, result);
      expect(collected).toEqual(expected);
    });
  });
  describe("", () => {
    const command: PluginValuesPath = {
      scalars: {
        category: "struct",
        name: "ItemCollection",
        scalars: undefined,
        scalarArrays: [
          {
            path: `$.items[*]`,
            param: { name: "items", attr: { default: [], kind: "string[]" } },
          },
        ],
        objectSchema: {
          name: { default: "", kind: "string" },
          age: { default: 0, kind: "number" },
        },
      },
      structArrays: { items: [], errors: [] },
      structs: { items: [], errors: [] },
    };
    test("", () => {
      const result = buildPluginValuesPathSchemaV3(command);
      expect(result).lengthOf(1);
    });
    test("", () => {
      const expected: PluginValues[] = [
        {
          value: 1,
          category: "struct",
          name: "ItemCollection",
          param: {
            name: "items",
            attr: { default: [], kind: "number[]" },
          },
        },
        {
          value: 2,
          category: "struct",
          name: "ItemCollection",
          param: {
            name: "items",
            attr: { default: [], kind: "number[]" },
          },
        },
        {
          value: 3,
          category: "struct",
          name: "ItemCollection",
          param: {
            name: "items",
            attr: { default: [], kind: "number[]" },
          },
        },
      ];

      const result = buildPluginValuesPathSchemaV3(command);
      const collected = collectPluginValues(mockData, result);
      expect(collected).toEqual(expected);
    });
  });
});
