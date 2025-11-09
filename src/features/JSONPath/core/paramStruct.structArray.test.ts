import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParamsEx,
  ClassifiedPluginParams,
  PluginParamEx,
  StructRefParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { getPathFromStructParam } from "./paramStruct";
import type {
  StructPropertysPath,
  StructPathResult,
} from "./value/types/pathSchemaTypes";

interface Person {
  name: string;
  age: number;
}

interface Item {
  itemId: number;
  itemName: string;
}

interface ClassRoom {
  students: Person[];
  items: Item[];
}

const personSchema: ClassifiedPluginParamsEx<Person> = {
  scalaArrays: [],
  structs: [],
  structArrays: [],
  scalas: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "age", attr: { kind: "number", default: 0 } },
  ],
};

const classRoomSchema: ClassifiedPluginParamsEx<ClassRoom> = {
  scalaArrays: [],
  structs: [],
  scalas: [],
  structArrays: [
    {
      name: "students",
      attr: { struct: "Person", kind: "struct[]" },
    },
    {
      name: "items",
      attr: { struct: "Item", kind: "struct[]" },
    },
  ],
};

const itemSchema: ClassifiedPluginParamsEx<Item> = {
  scalaArrays: [],
  structs: [],
  structArrays: [],
  scalas: [
    { name: "itemId", attr: { kind: "number", default: 0 } },
    { name: "itemName", attr: { kind: "string", default: "" } },
  ],
};

const structsMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map<
  string,
  ClassifiedPluginParams
>([
  ["Person", personSchema],
  ["ClassRoom", classRoomSchema],
  ["Item", itemSchema],
]);

describe("getPathFromStructParam", () => {
  const path1: StructPropertysPath = {
    objectSchema: {
      age: { default: 0, kind: "number" },
      name: { default: "", kind: "string" },
    },
    scalaArrays: [],
    scalas: '$.classRoom.students[*]["name","age"]',
    structName: "Person",
  };
  const path2: StructPropertysPath = {
    objectSchema: {
      itemId: { default: 0, kind: "number" },
      itemName: { default: "", kind: "string" },
    },
    scalaArrays: [],
    scalas: '$.classRoom.items[*]["itemId","itemName"]',
    structName: "Item",
  };

  test("classRoom.students", () => {
    const params: ReadonlyArray<PluginParamEx<StructRefParam>> = [
      { name: "classRoom", attr: { kind: "struct", struct: "ClassRoom" } },
    ];
    const result: StructPathResult = getPathFromStructParam(
      params,
      "$",
      structsMap
    );
    const expected: StructPropertysPath[] = [path1, path2];
    expect(result.errors).toEqual([]);
    expect(result.items).toEqual(expected);
  });
});
