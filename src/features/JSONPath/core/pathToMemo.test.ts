import type { MockedFunction } from "vitest";
import { describe, test, expect, vi } from "vitest";
import type {
  ClassifiedPluginParamsEx,
  ClassifiedPluginParams,
  PluginParamEx,
  StructRefParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { toObjectPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type {
  PluginValuesPathNewVersion,
  PluginValuesPathWithError,
} from "./createPath/types";
import { createPluginValuesPathPP } from "./createPath/valuePath";
import { runMemoBundle } from "./memo2/memo3";
import type { PluginValues } from "./memo2/types";
import type { MemoBundle } from "./memo2/types/memo3";
import { createMemoFromPath } from "./pathToMemo";

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface Person {
  name: string;
  age: number;
  items: number[];
  nicknames: string[];
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

const createMockFunc = (): MockedFunction<(path: string) => JSONPathJS> => {
  return vi.fn(newJSONPath);
};

const newJSONPath = (path: string): JSONPathJS => {
  return new JSONPathJS(path);
};

describe("address", () => {
  const paramSchema: PluginParamEx<StructRefParam> = {
    name: "address",
    attr: { kind: "struct", struct: "Address" },
  };
  const paramObject = {
    address: {
      city: "Sample City",
      street: "123 Sample St",
      zipCode: "12345",
    } as const satisfies Address,
  };

  const pathV2: PluginValuesPathWithError = {
    scalars: {
      category: "param",
      name: "address",
      objectSchema: {},
      scalars: undefined,
      scalarArrays: [],
    },
    structArrays: { items: [], errors: [] },
    structs: {
      items: [
        {
          category: "struct",
          name: "Address",
          scalars: `$.address["street","city","zipCode"]`,
          scalarArrays: [],
          objectSchema: toObjectPluginParams(addressSchema.scalars),
        },
      ],
      errors: [],
    },
  };

  test("p2", () => {
    const result: PluginValuesPathWithError = createPluginValuesPathPP(
      "param",
      paramSchema,
      makeMap()
    );
    expect(result.structArrays).toEqual(pathV2.structArrays);
    expect(result.scalars).toEqual(pathV2.scalars);
    expect(result.structs).toEqual(pathV2.structs);
    //    expect(result).toEqual(pathV2);
  });

  test("calls jsonPath factory", () => {
    const mockFn = createMockFunc();
    createMemoFromPath(pathV2, mockFn);
    expect(mockFn).toBeCalledWith('$.address["street","city","zipCode"]');
    expect(mockFn).toBeCalledTimes(1);
  });

  test("createMemoFromPath", () => {
    const memo: MemoBundle = createMemoFromPath(pathV2, newJSONPath);
    expect(memo.top.scalar).toBeUndefined();
    expect(memo.top.arrays).toEqual([]);
    expect(memo.structs).toHaveLength(1);
    expect(memo.structArrays).toHaveLength(0);
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
    const memo: MemoBundle = createMemoFromPath(pathV2, newJSONPath);
    const values: PluginValues[] = runMemoBundle(
      "struct",
      "Address",
      paramObject,
      memo
    );
    expect(values).toEqual(expectedValues);
  });
});

describe("Person", () => {
  const paramSchema: PluginParamEx<StructRefParam> = {
    name: "person",
    attr: { kind: "struct", struct: "Person" },
  };
  const paramObject = {
    person: {
      name: "Alice",
      age: 30,
      items: [115, 201, 351],
      nicknames: ["Ally", "Lice"],
    } as const satisfies Person,
  };
  const pathV2: PluginValuesPathNewVersion = {
    category: "param",
    scalars: {
      category: "param",
      name: "person",
      objectSchema: {},
      scalars: undefined,
      scalarArrays: [],
    },
    structArrays: { items: [], errors: [] },
    structs: {
      items: [
        {
          category: "struct",
          name: "Person",
          scalars: `$.person["name","age"]`,
          objectSchema: {
            name: { default: "", kind: "string" },
            age: { default: 0, kind: "number" },
          },
          scalarArrays: [
            {
              param: { name: "items", attr: { kind: "number[]", default: [] } },
              path: "$.person.items[*]",
            },
            {
              param: {
                name: "nicknames",
                attr: { kind: "string[]", default: [] },
              },
              path: "$.person.nicknames[*]",
            },
          ],
        },
      ],
      errors: [],
    },
  };
  test("p2", () => {
    const result: PluginValuesPathWithError = createPluginValuesPathPP(
      "param",
      paramSchema,
      makeMap()
    );
    expect(result.structArrays).toEqual(pathV2.structArrays);
    expect(result.scalars).toEqual(pathV2.scalars);
    expect(result.structs).toEqual(pathV2.structs);
  });
  test("memo3", () => {
    const mockFn = createMockFunc();
    createMemoFromPath(pathV2, mockFn);
    expect(mockFn).toBeCalledWith('$.person["name","age"]');
    expect(mockFn).toBeCalledWith("$.person.items[*]");
    expect(mockFn).toBeCalledWith("$.person.nicknames[*]");
    expect(mockFn).toBeCalledTimes(3);
  });
  test("memo3", () => {
    const expectedValues: PluginValues[] = [
      {
        category: "struct",
        name: "Person",
        param: {
          name: "name",
          attr: { default: "", kind: "string" },
        },
        value: "Alice",
      },
      {
        category: "struct",
        name: "Person",
        value: 30,
        param: {
          name: "age",
          attr: { default: 0, kind: "number" },
        },
      },
      {
        category: "struct",
        name: "Person",
        value: 115,
        param: {
          name: "items",
          attr: { default: [], kind: "number[]" },
        },
      },
      {
        category: "struct",
        name: "Person",
        value: 201,
        param: {
          name: "items",
          attr: { default: [], kind: "number[]" },
        },
      },
      {
        category: "struct",
        name: "Person",
        value: 351,
        param: {
          name: "items",
          attr: { default: [], kind: "number[]" },
        },
      },
      {
        category: "struct",
        name: "Person",
        value: "Ally",
        param: {
          name: "nicknames",
          attr: { default: [], kind: "string[]" },
        },
      },
      {
        category: "struct",
        name: "Person",
        value: "Lice",
        param: {
          name: "nicknames",
          attr: { default: [], kind: "string[]" },
        },
      },
    ];
    const memo: MemoBundle = createMemoFromPath(pathV2, newJSONPath);
    const values: PluginValues[] = runMemoBundle(
      "struct",
      "Person",
      paramObject,
      memo
    );
    expect(values).toEqual(expectedValues);
  });
});
