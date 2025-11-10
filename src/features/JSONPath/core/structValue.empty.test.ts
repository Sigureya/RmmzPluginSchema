import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParams,
  PluginParamEx,
  StructRefParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { getPathFromStructParam } from "./structValue";
import type { StructPropertysPath } from "./types/pathSchemaTypes";

describe("empty struct", () => {
  test("getPathFromStruct", () => {
    const schema: ClassifiedPluginParams = {
      scalars: [],
      scalarArrays: [],
      structs: [],
      structArrays: [],
    };
    const param: PluginParamEx<StructRefParam> = {
      name: "emptyStruct",
      attr: { kind: "struct", struct: "EmptyStruct" },
    };
    const structMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map([
      ["EmptyStruct", schema],
    ]);
    const result = getPathFromStructParam([param], "$", structMap);
    expect(result.items).toEqual([]);
  });
  test("", () => {
    const schema: ClassifiedPluginParams = {
      scalars: [{ name: "actorId", attr: { kind: "actor", default: 0 } }],
      scalarArrays: [],
      structs: [],
      structArrays: [],
    };
    const param: PluginParamEx<StructRefParam> = {
      name: "notEmptyStruct",
      attr: { kind: "struct", struct: "NotEmptyStruct" },
    };
    const structMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map([
      ["NotEmptyStruct", schema],
    ]);
    const result = getPathFromStructParam([param], "$", structMap);
    const expected: StructPropertysPath[] = [
      {
        category: "struct",
        name: "NotEmptyStruct",
        scalars: `$.notEmptyStruct["actorId"]`,
        scalarArrays: [],
        objectSchema: {
          actorId: { kind: "actor", default: 0 },
        },
      },
    ];
    expect(result.items).toEqual(expected);
  });
  test("struct array", () => {
    const schema: ClassifiedPluginParams = {
      scalars: [],
      scalarArrays: [
        {
          name: "numberArray",
          attr: { kind: "number[]", default: [] },
        },
      ],
      structArrays: [],
      structs: [],
    };
    const param: PluginParamEx<StructRefParam> = {
      name: "emptyStructArray",
      attr: { kind: "struct", struct: "EmptyStructArray" },
    };
    const structMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map([
      ["EmptyStructArray", schema],
    ]);
    const result = getPathFromStructParam([param], "$", structMap);
    const expected: StructPropertysPath[] = [
      {
        category: "struct",
        name: "EmptyStructArray",
        objectSchema: {},
        scalars: undefined,
        scalarArrays: [
          {
            path: "$.emptyStructArray.numberArray[*]",
            param: schema.scalarArrays[0],
          },
        ],
      },
    ];
    expect(result.items).toEqual(expected);
  });
});
