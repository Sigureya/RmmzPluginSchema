import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParamsEx,
  PluginParamEx,
  StructRefParam,
  ClassifiedPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { toObjectPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import { getPathFromStructParam, getPathFromStructSchema } from "./structValue";
import type { StructPropertysPath, StructPathResult } from "./types";

interface MockPerson {
  name: string;
  age: number;
  b: boolean;
  numberArray: number[];
  stringArray: string[];
}

describe("person", () => {
  const personSchema: ClassifiedPluginParamsEx<MockPerson> = {
    scalars: [
      { name: "name", attr: { kind: "string", default: "" } },
      { name: "age", attr: { kind: "number", default: 0 } },
      { name: "b", attr: { kind: "boolean", default: false } },
    ],
    scalarArrays: [
      { name: "numberArray", attr: { kind: "number[]", default: [] } },
      { name: "stringArray", attr: { kind: "string[]", default: [] } },
    ],
    structs: [],
    structArrays: [],
  };
  const expected = [
    {
      category: "struct",
      name: "MockPerson",
      scalars: `$.person["name","age","b"]`,
      scalarArrays: [
        {
          path: "$.person.numberArray[*]",

          param: personSchema.scalarArrays[0],
        },
        {
          path: "$.person.stringArray[*]",
          param: personSchema.scalarArrays[1],
        },
      ],
      objectSchema: toObjectPluginParams(personSchema.scalars),
    },
  ] as const satisfies StructPropertysPath[];
  test("getPathFromStruct", () => {
    const param = {
      name: "person",
      attr: { kind: "struct", struct: "MockPerson" },
    } as const satisfies PluginParamEx<StructRefParam>;
    const structMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map([
      ["MockPerson", personSchema],
    ]);
    const result = getPathFromStructParam([param], "$", structMap);
    expect(result.items).toEqual(expected);
  });

  test("getPathFromStructSchema", () => {
    const result: StructPathResult = getPathFromStructSchema(
      "MockPerson",
      "$.person",
      new Map([["MockPerson", personSchema]])
    );
    expect(result.items).toEqual(expected);
  });

  test("isvalid path", () => {
    expected.forEach((item) => {
      expect(() => {
        new JSONPathJS(item.scalars);
      }).not.toThrow();
      item.scalarArrays.forEach((path) => {
        expect(() => {
          new JSONPathJS(path.path);
        }).not.toThrow();
      });
    });
  });
});
