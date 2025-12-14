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
  PluginValuesPath,
  PluginValuesPathBase,
} from "./createPath/types";
import { createStructParamPath } from "./createPath/valuePath";
import { extractAllPluginValues } from "./extractor/extractor";
import type {
  PluginValuesExtractorBundle,
  PluginValues,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

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

describe("Address path generation and value extraction", () => {
  const paramSchema: PluginParamEx<StructRefParam> = {
    name: "address",
    attr: { kind: "struct", struct: "Address" },
  };

  const pathSchema: PluginValuesPath = {
    rootCategory: "param",
    rootName: "address",
    scalars: undefined,
    structArrays: { items: [], errors: [] },
    structs: {
      items: [
        {
          category: "struct",
          name: "Address",
          scalarsPath: `$.address["street","city","zipCode"]`,
          scalarArrays: [],
          objectSchema: toObjectPluginParams(addressSchema.scalars),
        },
      ],
      errors: [],
    },
  };

  test("createPluginValuesPath", () => {
    const map = makeMockedMap();
    const result: PluginValuesPathBase = createStructParamPath(
      "param",
      paramSchema,
      map
    );
    expect(map.get).toBeCalledWith("Address");
    expect(map.get).toBeCalledTimes(1);
    expect(result.structArrays).toEqual(pathSchema.structArrays);
    expect(result.scalars).toBeUndefined();
    expect(result.structs).toEqual(pathSchema.structs);
    expect(result).toEqual(pathSchema);
  });
  describe("compileJSONPathSchema", () => {
    test("calls JSONPath constructor", () => {
      const mockFn = createMockFunc();
      compileJSONPathSchema(pathSchema, mockFn);
      expect(mockFn).toBeCalledWith('$.address["street","city","zipCode"]');
      expect(mockFn).toBeCalledTimes(1);
    });

    test("creates correct memo structure", () => {
      const memo: PluginValuesExtractorBundle = compileJSONPathSchema(
        pathSchema,
        newJSONPath
      );
      expect(memo.top).toBeUndefined();
      expect(memo.structArrays).toEqual([]);
      expect(memo.structs).toHaveLength(1);
    });
  });
  test("extracts correct values via memo", () => {
    const paramObject = {
      address: {
        city: "Sample City",
        street: "123 Sample St",
        zipCode: "12345",
      } as const satisfies Address,
    };
    const expectedValues: PluginValues[] = [
      {
        rootType: "param",
        roootName: "address",
        structName: "Address",
        param: { name: "street", attr: { kind: "string", default: "" } },
        value: "123 Sample St",
      },
      {
        rootType: "param",
        roootName: "address",
        structName: "Address",
        param: { name: "city", attr: { kind: "string", default: "" } },
        value: "Sample City",
      },
      {
        rootType: "param",
        roootName: "address",
        structName: "Address",
        param: { name: "zipCode", attr: { kind: "string", default: "" } },
        value: "12345",
      },
    ];
    const memo: PluginValuesExtractorBundle = compileJSONPathSchema(
      pathSchema,
      newJSONPath
    );
    expect(memo.rootName).toBe("address");
    const values: PluginValues[] = extractAllPluginValues(paramObject, [memo]);
    expect(values).toEqual(expectedValues);
  });
});

describe("Person path generation and value extraction", () => {
  const paramSchema: PluginParamEx<StructRefParam> = {
    name: "person",
    attr: { kind: "struct", struct: "Person" },
  };
  const pathSchema: PluginValuesPath = {
    rootCategory: "param",
    rootName: "person",
    scalars: undefined,
    structArrays: { items: [], errors: [] },
    structs: {
      items: [
        {
          category: "struct",
          name: "Person",
          scalarsPath: `$.person["name","age"]`,
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

  test("resolves struct schema via map", () => {
    const map = makeMockedMap();
    createStructParamPath("param", paramSchema, map);
    expect(map.get).toBeCalledWith("Person");
    expect(map.get).toBeCalledTimes(1);
  });

  test("creates correct path schema", () => {
    const result = createStructParamPath("param", paramSchema, makeMap());
    expect(result.rootCategory).toEqual(pathSchema.rootCategory);
    expect(result.rootName).toEqual(pathSchema.rootName);
    expect(result.structArrays).toEqual(pathSchema.structArrays);
    expect(result.scalars).toBeUndefined();
    expect(result.structs).toEqual(pathSchema.structs);
    expect(result).toEqual(pathSchema);
  });
  describe("compileJSONPathSchema", () => {
    test("calls JSONPath constructor", () => {
      const mockFn = createMockFunc();
      compileJSONPathSchema(pathSchema, mockFn);
      expect(mockFn).toBeCalledWith('$.person["name","age"]');
      expect(mockFn).toBeCalledWith("$.person.items[*]");
      expect(mockFn).toBeCalledWith("$.person.nicknames[*]");
      expect(mockFn).toBeCalledTimes(3);
    });
    test("extracts correct values via memo", () => {
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
          rootType: "param",
          roootName: "person",
          structName: "Person",
          param: {
            name: "name",
            attr: { default: "", kind: "string" },
          },
          value: "Alice",
        },
        {
          rootType: "param",
          roootName: "person",
          structName: "Person",
          value: 30,
          param: {
            name: "age",
            attr: { default: 0, kind: "number" },
          },
        },
        {
          rootType: "param",
          roootName: "person",
          structName: "Person",
          value: 115,
          param: {
            name: "items",
            attr: { default: [], kind: "number[]" },
          },
        },
        {
          rootType: "param",
          roootName: "person",
          structName: "Person",
          value: 201,
          param: {
            name: "items",
            attr: { default: [], kind: "number[]" },
          },
        },
        {
          rootType: "param",
          roootName: "person",
          structName: "Person",
          value: 351,
          param: {
            name: "items",
            attr: { default: [], kind: "number[]" },
          },
        },
        {
          rootType: "param",
          roootName: "person",
          structName: "Person",
          value: "Ally",
          param: {
            name: "nicknames",
            attr: { default: [], kind: "string[]" },
          },
        },
        {
          rootType: "param",
          roootName: "person",
          structName: "Person",
          value: "Lice",
          param: {
            name: "nicknames",
            attr: { default: [], kind: "string[]" },
          },
        },
      ];
      const memo: PluginValuesExtractorBundle = compileJSONPathSchema(
        pathSchema,
        newJSONPath
      );
      const values: PluginValues[] = extractAllPluginValues(paramObject, [
        memo,
      ]);
      expect(values).toEqual(expectedValues);
    });
  });
});

describe("classroom path generation and value extraction", () => {
  const paramSchema: PluginParamEx<StructRefParam> = {
    name: "classroom",
    attr: { kind: "struct", struct: "Class" },
  };

  const pathSchema: PluginValuesPath = {
    rootCategory: "param",
    rootName: "classroom",
    scalars: undefined,
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
          scalarsPath: '$.classroom["className"]',
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
          scalarsPath: '$.classroom.teacher["name","age"]',
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
          scalarsPath: '$.classroom.students[*]["name","age"]',
        },
      ],
    },
  };
  describe("createPluginValuesPath", () => {
    test("resolves nested class/person schemas", () => {
      const map = makeMockedMap();
      createStructParamPath("param", paramSchema, map);
      expect(map.get).toHaveBeenNthCalledWith(1, "Class");
      expect(map.get).toHaveBeenNthCalledWith(2, "Person");
      expect(map.get).toHaveBeenNthCalledWith(3, "Person");
      expect(map.get).toBeCalledTimes(3);
    });
    test("creates correct path schema", () => {
      const result = createStructParamPath("param", paramSchema, makeMap());
      expect(result.rootCategory).toEqual(pathSchema.rootCategory);
      expect(result.rootName).toEqual(pathSchema.rootName);
      expect(result.structArrays).toEqual(pathSchema.structArrays);
      expect(result.scalars).toBeUndefined();
      expect(result.structs).toEqual(pathSchema.structs);
      expect(result).toEqual(pathSchema);
    });
  });
  describe("createMemoFromPath", () => {
    test("creates JSONPath objects for all schema paths", () => {
      const mockFn = createMockFunc();
      compileJSONPathSchema(pathSchema, mockFn);
      expect(mockFn).toBeCalledWith('$.classroom["className"]');
      expect(mockFn).toBeCalledWith('$.classroom.teacher["name","age"]');
      expect(mockFn).toBeCalledWith("$.classroom.teacher.items[*]");
      expect(mockFn).toBeCalledWith("$.classroom.teacher.nicknames[*]");
      expect(mockFn).toBeCalledWith('$.classroom.students[*]["name","age"]');
      expect(mockFn).toBeCalledWith("$.classroom.students[*].items[*]");
      expect(mockFn).toBeCalledWith("$.classroom.students[*].nicknames[*]");
      expect(mockFn).toBeCalledTimes(7);
    });
  });
  test("extracts all expected scalar values from ClassRoom object", () => {
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
        roootName: "classroom",
        rootType: "param",
        structName: "Class",
        value: "Math 101",
        param: {
          name: "className",
          attr: { default: "", kind: "string" },
        },
      },
      {
        rootType: "param",
        roootName: "classroom",
        structName: "Person",
        value: "Mr. Smith",
        param: {
          name: "name",
          attr: { default: "", kind: "string" },
        },
      },
      {
        roootName: "classroom",
        rootType: "param",
        structName: "Person",
        value: 40,
        param: {
          name: "age",
          attr: { default: 0, kind: "number" },
        },
      },
      {
        roootName: "classroom",
        rootType: "param",
        structName: "Person",
        value: 1001,
        param: {
          name: "items",
          attr: { default: [], kind: "number[]" },
        },
      },
      {
        structName: "Person",
        value: 1002,
        param: {
          attr: {
            default: [],
            kind: "number[]",
          },
          name: "items",
        },
        roootName: "classroom",
        rootType: "param",
      },
      {
        structName: "Person",
        value: "Smitty",
        param: {
          attr: {
            kind: "string[]",
            default: [],
          },
          name: "nicknames",
        },
        roootName: "classroom",
        rootType: "param",
      },
      {
        structName: "Person",
        value: "Alice",
        param: {
          attr: {
            default: "",
            kind: "string",
          },
          name: "name",
        },
        roootName: "classroom",
        rootType: "param",
      },
      {
        structName: "Person",
        param: {
          attr: {
            default: 0,
            kind: "number",
          },
          name: "age",
        },
        roootName: "classroom",
        rootType: "param",
        value: 20,
      },
      {
        structName: "Person",
        param: {
          attr: {
            default: "",
            kind: "string",
          },
          name: "name",
        },
        roootName: "classroom",
        rootType: "param",
        value: "Bob",
      },
      {
        structName: "Person",
        param: {
          attr: {
            default: 0,
            kind: "number",
          },
          name: "age",
        },
        roootName: "classroom",
        rootType: "param",
        value: 22,
      },
      {
        structName: "Person",
        param: {
          attr: {
            default: [],
            kind: "number[]",
          },
          name: "items",
        },
        roootName: "classroom",
        rootType: "param",
        value: 2001,
      },
      {
        structName: "Person",
        param: {
          attr: {
            default: [],
            kind: "number[]",
          },
          name: "items",
        },
        roootName: "classroom",
        rootType: "param",
        value: 2002,
      },
      {
        structName: "Person",
        param: {
          attr: {
            default: [],
            kind: "number[]",
          },
          name: "items",
        },
        roootName: "classroom",
        rootType: "param",
        value: 3001,
      },
      {
        structName: "Person",
        param: {
          attr: {
            default: [],
            kind: "string[]",
          },
          name: "nicknames",
        },
        roootName: "classroom",
        rootType: "param",
        value: "Ally",
      },
      {
        structName: "Person",
        param: {
          attr: {
            default: [],
            kind: "string[]",
          },
          name: "nicknames",
        },
        roootName: "classroom",
        rootType: "param",
        value: "Bobby",
      },
      {
        structName: "Person",
        param: {
          attr: {
            default: [],
            kind: "string[]",
          },
          name: "nicknames",
        },
        roootName: "classroom",
        rootType: "param",
        value: "Rob",
      },
    ];
    const memo: PluginValuesExtractorBundle = compileJSONPathSchema(
      pathSchema,
      newJSONPath
    );
    const values: PluginValues[] = extractAllPluginValues(paramObject, [memo]);
    expect(values).toEqual(expectedValues);
  });
});
describe("School path generation and value extraction", () => {
  const paramSchema: PluginParamEx<StructRefParam> = {
    name: "school",
    attr: { kind: "struct", struct: "School" },
  };
  const pathSchema: PluginValuesPath = {
    rootCategory: "param",
    rootName: "school",
    scalars: undefined,
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
          scalarsPath: '$.school["since"]',
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
          scalarsPath: '$.school.address["street","city","zipCode"]',
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
          scalarsPath: '$.school.classrooms[*]["className"]',
          scalarArrays: [],
        },
        {
          category: "struct",
          name: "Person",
          objectSchema: {
            age: { kind: "number", default: 0 },
            name: { kind: "string", default: "" },
          },
          scalarsPath: '$.school.classrooms[*].teacher["name","age"]',
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
          scalarsPath: '$.school.classrooms[*].students[*]["name","age"]',
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
  describe("createPluginValuesPath", () => {
    test("resolves all referenced struct schemas", () => {
      const map = makeMockedMap();
      createStructParamPath("param", paramSchema, map);
      expect(map.get).toHaveBeenNthCalledWith(1, "School");
      expect(map.get).toHaveBeenNthCalledWith(2, "Address");
      expect(map.get).toHaveBeenNthCalledWith(3, "Class");
      expect(map.get).toHaveBeenNthCalledWith(4, "Person");
      expect(map.get).toHaveBeenNthCalledWith(5, "Person");
      expect(map.get).toBeCalledTimes(5);
    });
    test("generates complete School path schema", () => {
      const result = createStructParamPath("param", paramSchema, makeMap());
      expect(result.rootCategory).toEqual(pathSchema.rootCategory);
      expect(result.rootName).toEqual(pathSchema.rootName);
      expect(result.scalars).toEqual(pathSchema.scalars);
      expect(result.structArrays).toEqual(pathSchema.structArrays);
      expect(result.structs).toEqual(pathSchema.structs);
      expect(result).toEqual(pathSchema);
    });
  });
  describe("compileJSONPathSchema", () => {
    test("creates JSONPath objects for all schema paths", () => {
      const mockFn = createMockFunc();
      compileJSONPathSchema(pathSchema, mockFn);
      const paths: string[] = [
        '$.school["since"]',
        '$.school.address["street","city","zipCode"]',
        '$.school.classrooms[*]["className"]',
        '$.school.classrooms[*].teacher["name","age"]',
        "$.school.classrooms[*].teacher.items[*]",
        "$.school.classrooms[*].teacher.nicknames[*]",
        '$.school.classrooms[*].students[*]["name","age"]',
        "$.school.classrooms[*].students[*].items[*]",
        "$.school.classrooms[*].students[*].nicknames[*]",
      ];
      expect(mockFn).toBeCalledTimes(paths.length);
      paths.forEach((path) => {
        expect(mockFn, `call xx : ${path}`).toBeCalledWith(path);
      });
    });
    test("extracts all expected scalar values from School object", () => {
      const paramObject = {
        school: {
          since: 1995,
          address: {
            street: "456 School Rd",
            city: "Education City",
            zipCode: "67890",
          },
          classrooms: [
            {
              className: "History 201",
              teacher: {
                name: "Ms. Johnson",
                age: 35,
                items: [1101],
                nicknames: ["Johnny"],
              },
              students: [
                {
                  name: "Charlie",
                  age: 21,
                  items: [2101, 2102],
                  nicknames: ["Chuck"],
                },
              ],
            },
          ],
        } as const satisfies School,
      };
      const expectedValues: PluginValues[] = [
        {
          roootName: "school",
          rootType: "param",
          structName: "School",
          param: {
            attr: {
              default: 0,
              kind: "number",
            },
            name: "since",
          },
          value: 1995,
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Address",
          param: {
            attr: {
              default: "",
              kind: "string",
            },
            name: "street",
          },
          value: "456 School Rd",
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Address",
          param: {
            attr: {
              default: "",
              kind: "string",
            },
            name: "city",
          },
          value: "Education City",
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Address",
          param: {
            attr: {
              default: "",
              kind: "string",
            },
            name: "zipCode",
          },
          value: "67890",
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Class",
          param: {
            attr: {
              default: "",
              kind: "string",
            },
            name: "className",
          },
          value: "History 201",
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Person",
          param: {
            attr: {
              default: "",
              kind: "string",
            },
            name: "name",
          },
          value: "Ms. Johnson",
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Person",
          param: {
            attr: {
              default: 0,
              kind: "number",
            },
            name: "age",
          },
          value: 35,
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Person",
          param: {
            attr: {
              default: [],
              kind: "number[]",
            },
            name: "items",
          },
          value: 1101,
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Person",
          param: {
            attr: {
              default: [],
              kind: "string[]",
            },
            name: "nicknames",
          },
          value: "Johnny",
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Person",
          param: {
            attr: {
              default: "",
              kind: "string",
            },
            name: "name",
          },
          value: "Charlie",
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Person",
          param: {
            attr: {
              default: 0,
              kind: "number",
            },
            name: "age",
          },
          value: 21,
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Person",
          param: {
            attr: {
              default: [],
              kind: "number[]",
            },
            name: "items",
          },
          value: 2101,
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Person",
          param: {
            attr: {
              default: [],
              kind: "number[]",
            },
            name: "items",
          },
          value: 2102,
        },
        {
          roootName: "school",
          rootType: "param",
          structName: "Person",
          param: {
            attr: {
              default: [],
              kind: "string[]",
            },
            name: "nicknames",
          },
          value: "Chuck",
        },
      ];
      const memo: PluginValuesExtractorBundle = compileJSONPathSchema(
        pathSchema,
        newJSONPath
      );
      const values: PluginValues[] = extractAllPluginValues(paramObject, [
        memo,
      ]);
      expect(values).toEqual(expectedValues);
    });
  });
});
