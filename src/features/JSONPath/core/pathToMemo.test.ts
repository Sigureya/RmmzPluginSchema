import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParamsEx,
  ClassifiedPluginParams,
  PluginParamEx,
  StructRefParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { toObjectPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { getPathFromStructParam } from "./createPath/structValue";
import type { StructPathResult, StructPropertysPath } from "./createPath/types";
import { memo3 } from "./memo2/memo3";
import type { PluginValues } from "./memo2/types";
import type { PluginValuesPathMemo4 } from "./memo2/types/memo3";
import { createMemoFromPath } from "./pathToMemo";

interface Person {
  name: string;
  age: number;
  items: number[];
  nicknames: string[];
}

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface Class {
  className: string;
  students: Person[];
  teacher: Person;
}

interface School {
  classrooms: Class[];
  address: Address;
  since: number;
}

const personScheame: ClassifiedPluginParamsEx<Person> = {
  structs: [],
  structArrays: [],
  scalars: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "age", attr: { kind: "number", default: 0 } },
  ],
  scalarArrays: [
    { name: "items", attr: { kind: "number[]", default: [] } },
    { name: "nicknames", attr: { kind: "string[]", default: [] } },
  ],
};

const addressSchema: ClassifiedPluginParamsEx<Address> = {
  structs: [],
  structArrays: [],
  scalars: [
    { name: "street", attr: { kind: "string", default: "" } },
    { name: "city", attr: { kind: "string", default: "" } },
    { name: "zipCode", attr: { kind: "string", default: "" } },
  ],
  scalarArrays: [],
};
const classRoomSchema: ClassifiedPluginParamsEx<Class> = {
  scalars: [{ name: "className", attr: { kind: "string", default: "" } }],
  scalarArrays: [],
  structs: [
    {
      name: "teacher",
      attr: { kind: "struct", struct: "Person" },
    },
  ],
  structArrays: [
    {
      name: "students",
      attr: { kind: "struct[]", struct: "Person", default: [] },
    },
  ],
};

const schoolSchema: ClassifiedPluginParamsEx<School> = {
  scalars: [{ name: "since", attr: { kind: "number", default: 0 } }],
  scalarArrays: [],
  structs: [{ name: "address", attr: { kind: "struct", struct: "Address" } }],
  structArrays: [
    {
      name: "classrooms",
      attr: { kind: "struct[]", struct: "Class", default: [] },
    },
  ],
};

const makeMap = (): ReadonlyMap<string, ClassifiedPluginParams> => {
  return new Map<string, ClassifiedPluginParams>([
    ["Person", personScheame],
    ["Address", addressSchema],
    ["Class", classRoomSchema],
    ["School", schoolSchema],
  ]);
};

describe("address", () => {
  const path: StructPropertysPath = {
    category: "struct",
    name: "Address",
    scalars: `$.address["street","city","zipCode"]`,
    scalarArrays: [],
    objectSchema: toObjectPluginParams(addressSchema.scalars),
  };
  const paramSchema = {
    name: "address",
    attr: { kind: "struct", struct: "Address" },
  } as const satisfies PluginParamEx<StructRefParam>;
  const paramObject = {
    address: {
      city: "Sample City",
      street: "123 Sample St",
      zipCode: "12345",
    } as const satisfies Address,
  };
  test("getPathFromStruct", () => {
    const structMap = makeMap();
    const result = getPathFromStructParam([paramSchema], "$", structMap);
    expect(result.items).toEqual([path]);
    expect(result.errors).toEqual([]);
  });

  test("memo3", () => {
    const expectedValues: PluginValues[] = [
      {
        category: "struct",
        name: "Address",
        param: { name: "street", attr: { kind: "string", default: "" } },
        value: "123 Sample St",
      },
      {
        category: "struct",
        name: "Address",
        param: { name: "city", attr: { kind: "string", default: "" } },
        value: "Sample City",
      },
      {
        category: "struct",
        name: "Address",
        param: { name: "zipCode", attr: { kind: "string", default: "" } },
        value: "12345",
      },
    ];
    const memo: PluginValuesPathMemo4 = createMemoFromPath({
      scalars: path,
      structArrays: { items: [] },
      structs: { items: [] },
    });
    const result: PluginValues[] = memo3(
      "struct",
      "Address",
      paramObject,
      memo
    );
    expect(result).toEqual(expectedValues);
  });
});

describe("Person", () => {
  const path: StructPropertysPath = {
    category: "struct",
    name: "Person",
    scalars: `$.person["name","age"]`,
    scalarArrays: [
      { path: "$.person.items[*]", param: personScheame.scalarArrays[0] },
      { path: "$.person.nicknames[*]", param: personScheame.scalarArrays[1] },
    ],
    objectSchema: toObjectPluginParams(personScheame.scalars),
  };
  const paramObject = {
    person: {
      name: "John Doe",
      age: 30,
      items: [1, 2, 3],
      nicknames: ["Johnny", "JD"],
    } as const satisfies Person,
  };
  test("getPathFromStruct", () => {
    const param = {
      name: "person",
      attr: { kind: "struct", struct: "Person" },
    } as const satisfies PluginParamEx<StructRefParam>;
    const structMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map([
      ["Person", personScheame],
    ]);
    const result: StructPathResult = getPathFromStructParam(
      [param],
      "$",
      structMap
    );
    expect(result.items).toEqual([path]);
    expect(result.errors).toEqual([]);
  });
  test("extractScalaValuesFromJson", () => {
    const expectedValues: PluginValues[] = [
      {
        category: "struct",
        name: "Person",
        param: { name: "name", attr: { kind: "string", default: "" } },
        value: "John Doe",
      },
      {
        category: "struct",
        name: "Person",
        param: { name: "age", attr: { kind: "number", default: 0 } },
        value: 30,
      },
      {
        category: "struct",
        name: "items",
        param: {
          name: "items",
          attr: { kind: "number[]", default: [] },
        },
        value: 1,
      },
      {
        category: "struct",
        name: "items",
        param: {
          name: "items",
          attr: { kind: "number[]", default: [] },
        },
        value: 2,
      },
      {
        category: "struct",
        name: "items",
        value: 3,
        param: {
          attr: {
            default: [],
            kind: "number[]",
          },
          name: "items",
        },
      },
      {
        category: "struct",
        name: "nicknames",
        value: "Johnny",
        param: {
          name: "nicknames",
          attr: { kind: "string[]", default: [] },
        },
      },
      {
        category: "struct",
        name: "nicknames",
        value: "JD",
        param: {
          name: "nicknames",
          attr: {
            kind: "string[]",
            default: [],
          },
        },
      },
    ];
    const memo = createMemoFromPath({
      scalars: path,
      structArrays: { items: [] },
      structs: { items: [] },
    });
    const result: PluginValues[] = memo3("struct", "Person", paramObject, memo);
    expect(result).toEqual(expectedValues);
  });
});
