import { describe, test, expect } from "vitest";
import type { PrimitiveParam } from "@RpgTypes/rmmz/plugin";
import {
  extractArrayValuesFromJson,
  extractScalarValuesFromJson,
} from "./value/paramStructRead";
import type { StructPropertysPath } from "./value/types/pathSchemaTypes";
import type {
  PluginValues,
  StringSequenceParamValues,
} from "./value/types/result";

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

describe("extractScalaValuesFromJson", () => {
  test("should return empty array when scalas is undefined", () => {
    const path: StructPropertysPath = {
      structName: "TestStruct",
      scalarArrays: [],
      objectSchema: {},
      scalars: undefined,
    };
    const reuslt = extractScalarValuesFromJson(mockData, path);
    expect(reuslt).toEqual([]);
  });
  test("should extract scala values from json", () => {
    const path: StructPropertysPath = {
      structName: "Person",
      scalarArrays: [],
      objectSchema: personSchema,
      scalars: "$.person['name','age','isStudent']",
    };
    const expected: PluginValues[] = [
      {
        structName: "Person",
        value: "Grad",
        param: {
          name: "name",
          attr: { kind: "string", default: "", text: "person name" },
        },
      },
      {
        structName: "Person",
        value: 30,
        param: { name: "age", attr: { kind: "number", default: 0 } },
      },
      {
        structName: "Person",
        value: false,
        param: { name: "isStudent", attr: { kind: "boolean", default: false } },
      },
    ];
    const result = extractScalarValuesFromJson(mockData, path);
    expect(result).toEqual(expected);
  });
  test("students", () => {
    const path: StructPropertysPath = {
      structName: "Person",

      scalarArrays: [],
      objectSchema: personSchema,
      scalars: `$.students[*]["name","age"]`,
    };
    const expected: PluginValues[] = [
      {
        structName: "Person",
        value: "Alice",
        param: {
          name: "name",
          attr: personSchema.name,
        },
      },
      {
        structName: "Person",
        value: 20,
        param: { name: "age", attr: personSchema.age },
      },
      {
        structName: "Person",
        value: "Bob",
        param: {
          name: "name",
          attr: personSchema.name,
        },
      },
      {
        structName: "Person",
        value: 22,
        param: { name: "age", attr: personSchema.age },
      },
      {
        structName: "Person",
        value: "Charlie",
        param: {
          name: "name",
          attr: personSchema.name,
        },
      },
      {
        structName: "Person",
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
      structName: "Person",
      scalars: undefined,
      objectSchema: personSchema,
      scalarArrays: [],
    };
    const result = extractArrayValuesFromJson(mockData, path);
    expect(result).toEqual([]);
  });
  test("should extract array values from json", () => {
    const path: StructPropertysPath = {
      structName: "Person",
      scalars: "dummyPath",
      objectSchema: personSchema,
      scalarArrays: [],
    };
    const result = extractArrayValuesFromJson(mockData, path);
    expect(result).toEqual([]);
  });
  test("should extract array values from json with scalaArrays", () => {
    const path: StructPropertysPath = {
      structName: "Person",
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
