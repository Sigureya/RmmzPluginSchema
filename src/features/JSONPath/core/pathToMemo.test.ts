import type { MockedFunction, MockedObject } from "vitest";
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
type MockedMap = MockedObject<ReadonlyMap<string, ClassifiedPluginParams>>;

const makeMap = (): ReadonlyMap<string, ClassifiedPluginParams> => {
  return new Map<string, ClassifiedPluginParams>([
    ["Person", personScheame],
    ["Address", addressSchema],
    ["Class", classRoomSchema],
    ["School", schoolSchema],
  ]);
};
const makeMockedMap = (): MockedMap => {
  const map = makeMap();
  const mockedMap: MockedMap = {
    size: map.size,
    entries: vi.fn(() => map.entries()),
    forEach: vi.fn((cb) => map.forEach(cb)),
    get: vi.fn((key: string) => map.get(key)),
    has: vi.fn((key: string) => map.has(key)),
    keys: vi.fn(() => map.keys()),
    values: vi.fn(() => map.values()),
    [Symbol.iterator]: vi.fn(() => map[Symbol.iterator]()),
  };
  return mockedMap;
};

const createMockFunc = (): MockedFunction<(path: string) => JSONPathJS> => {
  return vi.fn(newJSONPath);
};

const newJSONPath = (path: string): JSONPathJS => {
  return new JSONPathJS(path);
};
describe("pathToMemo", () => {
  describe("address", () => {
    const paramSchema: PluginParamEx<StructRefParam> = {
      name: "address",
      attr: { kind: "struct", struct: "Address" },
    };

    const pathSchema: PluginValuesPathNewVersion = {
      category: "param",
      name: "Address",
      scalars: {
        category: "param",
        name: "Address",
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
      const map = makeMockedMap();
      const result: PluginValuesPathWithError = createPluginValuesPathPP(
        "param",
        paramSchema,
        map
      );
      expect(map.get).toBeCalledWith("Address");
      expect(map.get).toBeCalledTimes(1);
      expect(result.structArrays).toEqual(pathSchema.structArrays);
      expect(result.scalars).toEqual(pathSchema.scalars);
      expect(result.structs).toEqual(pathSchema.structs);
      expect(result).toEqual(pathSchema);
    });

    test("createMemoFromPath - calls jsonPath factory", () => {
      const mockFn = createMockFunc();
      createMemoFromPath(pathSchema, mockFn);
      expect(mockFn).toBeCalledWith('$.address["street","city","zipCode"]');
      expect(mockFn).toBeCalledTimes(1);
    });

    test("createMemoFromPath - return values", () => {
      const memo: MemoBundle = createMemoFromPath(pathSchema, newJSONPath);
      expect(memo.top.scalar).toBeUndefined();
      expect(memo.top.arrays).toEqual([]);
      expect(memo.structArrays).toEqual([]);
      expect(memo.structs).toHaveLength(1);
    });

    test("runMemoBundle", () => {
      const paramObject = {
        address: {
          city: "Sample City",
          street: "123 Sample St",
          zipCode: "12345",
        } as const satisfies Address,
      };
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
      const memo: MemoBundle = createMemoFromPath(pathSchema, newJSONPath);
      const values: PluginValues[] = runMemoBundle("struct", paramObject, memo);
      expect(values).toEqual(expectedValues);
    });
  });

  describe("Person", () => {
    const paramSchema: PluginParamEx<StructRefParam> = {
      name: "person",
      attr: { kind: "struct", struct: "Person" },
    };
    const pathSchema: PluginValuesPathNewVersion = {
      category: "param",
      name: "Person",
      scalars: {
        category: "param",
        name: "Person",
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
                param: {
                  name: "items",
                  attr: { kind: "number[]", default: [] },
                },
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
      const map = makeMockedMap();
      const result = createPluginValuesPathPP("param", paramSchema, map);
      expect(map.get).toBeCalledWith("Person");
      expect(map.get).toBeCalledTimes(1);
      expect(result.category).toEqual(pathSchema.category);
      expect(result.name).toEqual(pathSchema.name);
      expect(result.structArrays).toEqual(pathSchema.structArrays);
      expect(result.scalars).toEqual(pathSchema.scalars);
      expect(result.structs).toEqual(pathSchema.structs);
    });
    test("JSONPath calls", () => {
      const mockFn = createMockFunc();
      createMemoFromPath(pathSchema, mockFn);
      expect(mockFn).toBeCalledWith('$.person["name","age"]');
      expect(mockFn).toBeCalledWith("$.person.items[*]");
      expect(mockFn).toBeCalledWith("$.person.nicknames[*]");
      expect(mockFn).toBeCalledTimes(3);
    });
    test("memo3", () => {
      const paramObject = {
        person: {
          name: "Alice",
          age: 30,
          items: [115, 201, 351],
          nicknames: ["Ally", "Lice"],
        } as const satisfies Person,
      };
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
      const memo: MemoBundle = createMemoFromPath(pathSchema, newJSONPath);
      const values: PluginValues[] = runMemoBundle("struct", paramObject, memo);
      expect(values).toEqual(expectedValues);
    });
  });
  describe("classroom", () => {
    const paramSchema: PluginParamEx<StructRefParam> = {
      name: "classroom",
      attr: { kind: "struct", struct: "Class" },
    };

    const pathSchema: PluginValuesPathNewVersion = {
      category: "param",
      name: "Class",
      scalars: {
        category: "param",
        name: "Class",
        objectSchema: {},
        scalars: undefined,
        scalarArrays: [],
      },
      structArrays: {
        errors: [],
        items: [],
      },
      structs: {
        errors: [],
        items: [
          {
            category: "struct",
            name: "Class",
            objectSchema: {
              className: { default: "", kind: "string" },
            },
            scalarArrays: [],
            scalars: '$.classroom["className"]',
          },
          {
            category: "struct",
            name: "Person",
            objectSchema: {
              age: { default: 0, kind: "number" },
              name: { default: "", kind: "string" },
            },
            scalarArrays: [
              {
                param: {
                  name: "items",
                  attr: { default: [], kind: "number[]" },
                },
                path: "$.classroom.teacher.items[*]",
              },
              {
                param: {
                  name: "nicknames",
                  attr: { default: [], kind: "string[]" },
                },
                path: "$.classroom.teacher.nicknames[*]",
              },
            ],
            scalars: '$.classroom.teacher["name","age"]',
          },
          {
            category: "struct",
            name: "Person",
            objectSchema: {
              age: { default: 0, kind: "number" },
              name: { default: "", kind: "string" },
            },
            scalarArrays: [
              {
                param: {
                  name: "items",
                  attr: { default: [], kind: "number[]" },
                },
                path: "$.classroom.students[*].items[*]",
              },
              {
                param: {
                  name: "nicknames",
                  attr: { default: [], kind: "string[]" },
                },
                path: "$.classroom.students[*].nicknames[*]",
              },
            ],
            scalars: '$.classroom.students[*]["name","age"]',
          },
        ],
      },
    };
    describe("createPluginValuesPath", () => {
      test("map calls", () => {
        const map = makeMockedMap();
        createPluginValuesPathPP("param", paramSchema, map);
        expect(map.get).toHaveBeenNthCalledWith(1, "Class");
        expect(map.get).toHaveBeenNthCalledWith(2, "Person");
        expect(map.get).toHaveBeenNthCalledWith(3, "Person");
        expect(map.get).toBeCalledTimes(3);
      });
      test("create path", () => {
        const result = createPluginValuesPathPP(
          "param",
          paramSchema,
          makeMap()
        );
        expect(result.category).toEqual(pathSchema.category);
        expect(result.name).toEqual(pathSchema.name);
        expect(result.structArrays).toEqual(pathSchema.structArrays);
        expect(result.scalars).toEqual(pathSchema.scalars);
        expect(result.structs).toEqual(pathSchema.structs);
      });
    });
    test("jsonPath calls", () => {
      const mockFn = createMockFunc();
      createMemoFromPath(pathSchema, mockFn);
      expect(mockFn).toBeCalledWith('$.classroom["className"]');
      expect(mockFn).toBeCalledWith('$.classroom.teacher["name","age"]');
      expect(mockFn).toBeCalledWith("$.classroom.teacher.items[*]");
      expect(mockFn).toBeCalledWith("$.classroom.teacher.nicknames[*]");
      expect(mockFn).toBeCalledWith('$.classroom.students[*]["name","age"]');
      expect(mockFn).toBeCalledWith("$.classroom.students[*].items[*]");
      expect(mockFn).toBeCalledWith("$.classroom.students[*].nicknames[*]");
      expect(mockFn).toBeCalledTimes(7);
    });
    test("memo3", () => {
      const paramObject = {
        classroom: {
          className: "Math 101",
          teacher: {
            name: "Mr. Smith",
            age: 40,
            items: [1001, 1002],
            nicknames: ["Smitty"],
          },
          students: [
            {
              name: "Alice",
              age: 20,
              items: [2001, 2002],
              nicknames: ["Ally"],
            },
            {
              name: "Bob",
              age: 22,
              items: [3001],
              nicknames: ["Bobby", "Rob"],
            },
          ],
        } as const satisfies Class,
      };
      const expectedValues: PluginValues[] = [
        {
          category: "param",
          name: "Class",
          value: "Math 101",
          param: {
            name: "className",
            attr: { default: "", kind: "string" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: "Mr. Smith",
          param: {
            name: "name",
            attr: { default: "", kind: "string" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: 40,
          param: {
            name: "age",
            attr: { default: 0, kind: "number" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: 1001,
          param: {
            name: "items",
            attr: { default: [], kind: "number[]" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: 1002,
          param: {
            name: "items",
            attr: { default: [], kind: "number[]" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: "Smitty",
          param: {
            name: "nicknames",
            attr: { default: [], kind: "string[]" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: "Alice",
          param: {
            name: "name",
            attr: { default: "", kind: "string" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: 20,
          param: {
            name: "age",
            attr: { default: 0, kind: "number" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: "Bob",
          param: {
            name: "name",
            attr: { default: "", kind: "string" },
          },
        },
        {
          category: "param",
          name: "Person",
          param: {
            attr: { default: 0, kind: "number" },
            name: "age",
          },
          value: 22,
        },
        {
          category: "param",
          name: "Person",
          value: 2001,
          param: {
            name: "items",
            attr: { default: [], kind: "number[]" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: 2002,
          param: {
            name: "items",
            attr: { default: [], kind: "number[]" },
          },
        },
        {
          category: "param",
          name: "Person",
          param: {
            attr: {
              default: [],
              kind: "number[]",
            },
            name: "items",
          },
          value: 3001,
        },
        {
          category: "param",
          name: "Person",
          value: "Ally",
          param: {
            name: "nicknames",
            attr: { default: [], kind: "string[]" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: "Bobby",
          param: {
            name: "nicknames",
            attr: { default: [], kind: "string[]" },
          },
        },
        {
          category: "param",
          name: "Person",
          value: "Rob",
          param: {
            name: "nicknames",
            attr: { default: [], kind: "string[]" },
          },
        },
      ];
      const memo: MemoBundle = createMemoFromPath(pathSchema, newJSONPath);
      const values: PluginValues[] = runMemoBundle("param", paramObject, memo);
      expect(values).toEqual(expectedValues);
    });
  });
  describe("school", () => {
    const paramSchema: PluginParamEx<StructRefParam> = {
      name: "school",
      attr: { kind: "struct", struct: "School" },
    };
    const pathSchema: PluginValuesPathNewVersion = {
      category: "param",
      name: "School",
      scalars: {
        category: "param",
        name: "School",
        objectSchema: {},
        scalars: undefined,
        scalarArrays: [],
      },
      structArrays: {
        errors: [],
        items: [],
      },
      structs: {
        errors: [],
        items: [
          {
            category: "struct",
            name: "School",
            objectSchema: {
              since: { kind: "number", default: 0 },
            },
            scalars: '$.school["since"]',
            scalarArrays: [],
          },
          {
            category: "struct",
            name: "Address",
            objectSchema: {
              city: { kind: "string", default: "" },
              street: { kind: "string", default: "" },
              zipCode: { kind: "string", default: "" },
            },
            scalars: '$.school.address["street","city","zipCode"]',
            scalarArrays: [],
          },
          {
            category: "struct",
            name: "Class",
            objectSchema: {
              className: {
                default: "",
                kind: "string",
              },
            },
            scalars: '$.school.classrooms[*]["className"]',
            scalarArrays: [],
          },
          {
            category: "struct",
            name: "Person",
            objectSchema: {
              age: { kind: "number", default: 0 },
              name: { kind: "string", default: "" },
            },
            scalars: '$.school.classrooms[*].teacher["name","age"]',
            scalarArrays: [
              {
                param: {
                  name: "items",
                  attr: { kind: "number[]", default: [] },
                },
                path: "$.school.classrooms[*].teacher.items[*]",
              },
              {
                param: {
                  name: "nicknames",
                  attr: { kind: "string[]", default: [] },
                },
                path: "$.school.classrooms[*].teacher.nicknames[*]",
              },
            ],
          },
          {
            category: "struct",
            name: "Person",
            objectSchema: {
              age: { kind: "number", default: 0 },
              name: { kind: "string", default: "" },
            },
            scalars: '$.school.classrooms[*].students[*]["name","age"]',
            scalarArrays: [
              {
                param: {
                  name: "items",
                  attr: { kind: "number[]", default: [] },
                },
                path: "$.school.classrooms[*].students[*].items[*]",
              },
              {
                param: {
                  name: "nicknames",
                  attr: { kind: "string[]", default: [] },
                },
                path: "$.school.classrooms[*].students[*].nicknames[*]",
              },
            ],
          },
        ],
      },
    };
    test("map calls", () => {
      const map = makeMockedMap();
      createPluginValuesPathPP("param", paramSchema, map);
      expect(map.get).toHaveBeenNthCalledWith(1, "School");
      expect(map.get).toHaveBeenNthCalledWith(2, "Address");
      expect(map.get).toHaveBeenNthCalledWith(3, "Class");
      expect(map.get).toHaveBeenNthCalledWith(4, "Person");
      expect(map.get).toHaveBeenNthCalledWith(5, "Person");
      expect(map.get).toBeCalledTimes(5);
    });
    test("create path", () => {
      const result = createPluginValuesPathPP("param", paramSchema, makeMap());
      expect(result.category).toEqual(pathSchema.category);
      expect(result.name).toEqual(pathSchema.name);
      expect(result.scalars).toEqual(pathSchema.scalars);
      //      expect(result.structArrays).toEqual(pathSchema.structArrays);
      expect(result.structs).toEqual(pathSchema.structs);
    });
  });
});
