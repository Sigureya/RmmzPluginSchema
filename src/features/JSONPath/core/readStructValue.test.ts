import { describe, test, expect } from "vitest";
import type { PrimitiveParam } from "@RpgTypes/rmmz/plugin";
import type { StructPropertysPath } from "./createPath/types/pathSchemaTypes";
import type { PluginValues } from "./memo2/types";
import {
  extractArrayValuesFromJson,
  extractScalarValuesFromJson,
} from "./readStructValue";
import type { StringSequenceParamValues } from "./types";

interface Person {
  name: string;
  age: number;
  isStudent: boolean;
  nicknames: string[];
}

interface MockData {
  person: Person;
  students: Person[];
}

const mockData = {
  person: {
    name: "Grad",
    age: 30,
    isStudent: false,
    nicknames: ["G", "Grady", "Big G"],
  },
  students: [
    { name: "Alice", age: 20, isStudent: true, nicknames: ["Ally", "Lice"] },
    { name: "Bob", age: 22, isStudent: false, nicknames: ["Bobby"] },
    { name: "Charlie", age: 19, isStudent: true, nicknames: [] },
  ],
} as const satisfies MockData;

const personSchema = {
  name: {
    kind: "string",
    default: "",
    text: "person name",
  },
  age: { kind: "number", default: 0 },
  isStudent: { kind: "boolean", default: false },
} as const satisfies Record<string, PrimitiveParam>;

describe.skip("readStructValue", () => {
  describe("extractScalaValuesFromJson", () => {
    test("should return empty array when scalas is undefined", () => {
      const path: StructPropertysPath = {
        category: "struct",
        name: "TestStruct",
        scalarArrays: [],
        objectSchema: {},
        scalars: undefined,
      };
      const reuslt = extractScalarValuesFromJson(mockData, path);
      expect(reuslt).toEqual([]);
    });
    test("should extract scala values from json", () => {
      const path: StructPropertysPath = {
        category: "struct",
        name: "Person",
        scalarArrays: [],
        objectSchema: personSchema,
        scalars: "$.person['name','age','isStudent']",
      };
      const expected: PluginValues[] = [
        {
          category: "struct",
          name: "Person",
          value: "Grad",
          param: {
            name: "name",
            attr: { kind: "string", default: "", text: "person name" },
          },
        },
        {
          category: "struct",
          name: "Person",
          value: 30,
          param: { name: "age", attr: { kind: "number", default: 0 } },
        },
        {
          category: "struct",
          name: "Person",
          value: false,
          param: {
            name: "isStudent",
            attr: { kind: "boolean", default: false },
          },
        },
      ];
      const result = extractScalarValuesFromJson(mockData, path);
      expect(result).toEqual(expected);
    });
    test("students", () => {
      const path: StructPropertysPath = {
        category: "struct",
        name: "Person",
        scalarArrays: [],
        objectSchema: personSchema,
        scalars: `$.students[*]["name","age"]`,
      };
      const expected: PluginValues[] = [
        {
          category: "struct",
          name: "Person",
          value: "Alice",
          param: {
            name: "name",
            attr: personSchema.name,
          },
        },
        {
          category: "struct",
          name: "Person",
          value: 20,
          param: { name: "age", attr: personSchema.age },
        },
        {
          category: "struct",
          name: "Person",
          value: "Bob",
          param: {
            name: "name",
            attr: personSchema.name,
          },
        },
        {
          category: "struct",
          name: "Person",
          value: 22,
          param: { name: "age", attr: personSchema.age },
        },
        {
          category: "struct",
          name: "Person",
          value: "Charlie",
          param: {
            name: "name",
            attr: personSchema.name,
          },
        },
        {
          category: "struct",
          name: "Person",
          value: 19,
          param: { name: "age", attr: personSchema.age },
        },
      ];
      const result = extractScalarValuesFromJson(mockData, path);
      expect(result).toEqual(expected);
    });
  });

  describe("extractArrayValuesFromJson", () => {
    test("should return empty array when scalaArrays is empty", () => {
      const path: StructPropertysPath = {
        category: "struct",
        name: "Person",
        scalars: undefined,
        objectSchema: personSchema,
        scalarArrays: [],
      };
      const result = extractArrayValuesFromJson(mockData, path);
      expect(result).toEqual([]);
    });
    test("should extract array values from json", () => {
      const path: StructPropertysPath = {
        category: "struct",
        name: "Person",
        scalars: "dummyPath",
        objectSchema: personSchema,
        scalarArrays: [],
      };
      const result = extractArrayValuesFromJson(mockData, path);
      expect(result).toEqual([]);
    });
    test("should extract array values from json with scalaArrays", () => {
      const path: StructPropertysPath = {
        category: "struct",
        name: "Person",
        scalars: undefined,
        objectSchema: personSchema,
        scalarArrays: [
          {
            path: "$.person.nicknames[*]",
            param: {
              name: "nicknames",
              attr: { kind: "string[]", default: [] },
            },
          },
        ],
      };
      const expected: StringSequenceParamValues[] = [
        {
          values: ["G", "Grady", "Big G"],
          valueType: "string",
          param: {
            name: "nicknames",
            attr: { kind: "string[]", default: [] },
          },
        },
      ];
      const result = extractArrayValuesFromJson(mockData, path);
      expect(result).toEqual(expected);
    });
  });
});
