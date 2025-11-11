import { describe, test, expect } from "vitest";
import type { PluginParamEx, ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import { extractScalaParams } from "./extractParam";
import type { PluginValues } from "./memo2/types/array";

interface Person {
  name: string;
  age: number;
  isStudent: boolean;
}

interface MockData {
  person: Person;
  students: Person[];
}

describe("extractScalaParams", () => {
  const mockData = {
    person: {
      name: "Alice",
      age: 30,
      isStudent: false,
    },
    students: [
      { name: "Bob", age: 20, isStudent: true },
      { name: "Charlie", age: 22, isStudent: true },
    ],
  } as const satisfies MockData;
  const schema = [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "age", attr: { kind: "number", default: 0 } },
    { name: "isStudent", attr: { kind: "boolean", default: false } },
  ] as const satisfies PluginParamEx<ScalarParam>[];

  test("path", () => {
    const result: PluginValues[] = extractScalaParams(
      mockData,
      "$.person['name','age','isStudent']",
      schema,
      "struct",
      "Person"
    );
    const expected: PluginValues[] = [
      { category: "struct", name: "Person", value: "Alice", param: schema[0] },
      { category: "struct", name: "Person", value: 30, param: schema[1] },
      { category: "struct", name: "Person", value: false, param: schema[2] },
    ];
    expect(result).toEqual(expected);
  });

  test("array", () => {
    const result: PluginValues[] = extractScalaParams(
      mockData,
      "$.students[*]['name','age','isStudent']",
      schema,
      "struct",
      "Person"
    );
    const expected: PluginValues[] = [
      { category: "struct", name: "Person", value: "Bob", param: schema[0] },
      { category: "struct", name: "Person", value: 20, param: schema[1] },
      { category: "struct", name: "Person", value: true, param: schema[2] },
      {
        category: "struct",
        name: "Person",
        value: "Charlie",
        param: schema[0],
      },
      { category: "struct", name: "Person", value: 22, param: schema[1] },
      { category: "struct", name: "Person", value: true, param: schema[2] },
    ];
    expect(result).toEqual(expected);
  });
});
