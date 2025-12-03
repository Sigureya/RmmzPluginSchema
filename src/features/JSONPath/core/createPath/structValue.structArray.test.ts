import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParamsEx,
  ClassifiedPluginParams,
  PluginParamEx,
  StructRefParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { getPathFromStructParam } from "./structValue";
import type { StructPropertysPath, StructPathResultWithError } from "./types";

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
  scalarArrays: [],
  structs: [],
  structArrays: [],
  scalars: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "age", attr: { kind: "number", default: 0 } },
  ],
};

const classRoomSchema: ClassifiedPluginParamsEx<ClassRoom> = {
  scalarArrays: [],
  structs: [],
  scalars: [],
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
  scalarArrays: [],
  structs: [],
  structArrays: [],
  scalars: [
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
    category: "struct",
    name: "Person",
    objectSchema: {
      age: { default: 0, kind: "number" },
      name: { default: "", kind: "string" },
    },
    scalarArrays: [],
    scalarsPath: '$.classRoom.students[*]["name","age"]',
  };
  const path2: StructPropertysPath = {
    category: "struct",
    name: "Item",
    objectSchema: {
      itemId: { default: 0, kind: "number" },
      itemName: { default: "", kind: "string" },
    },
    scalarArrays: [],
    scalarsPath: '$.classRoom.items[*]["itemId","itemName"]',
  };

  test("classRoom.students", () => {
    const param: PluginParamEx<StructRefParam> = {
      name: "classRoom",
      attr: { kind: "struct", struct: "ClassRoom" },
    };
    const result: StructPathResultWithError = getPathFromStructParam(
      param,
      "$",
      structsMap
    );
    const expected: StructPropertysPath[] = [path1, path2];
    expect(result.errors).toEqual([]);
    expect(result.items).toEqual(expected);
  });
});
