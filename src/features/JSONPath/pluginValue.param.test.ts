import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginStructParamTypeEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPath } from "./core";
import type { PluginValuesPathBase, PluginValuesPathWithError } from "./core";

interface Item {
  name: string;
  id: number;
}

interface Terms {
  use: string;
  gain: string;
  lose: string;
}

interface MockPluginParams {
  commandName: string;
  categorys: string[];
  terms: Terms;
  items: Item[];
}

const schemaItem: ClassifiedPluginParamsEx<Item> = {
  scalars: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "id", attr: { kind: "number", default: 0 } },
  ],
  scalarArrays: [],
  structArrays: [],
  structs: [],
};

const schemaTerms: ClassifiedPluginParamsEx<Terms> = {
  scalars: [
    { name: "use", attr: { kind: "string", default: "" } },
    { name: "gain", attr: { kind: "string", default: "" } },
    { name: "lose", attr: { kind: "string", default: "" } },
  ],
  scalarArrays: [],
  structArrays: [],
  structs: [],
};

const paramsSchema: PluginStructParamTypeEx<MockPluginParams>[] = [
  { name: "categorys", attr: { kind: "string[]", default: [] } },
  { name: "commandName", attr: { kind: "string", default: "" } },
  { name: "terms", attr: { kind: "struct", struct: "Terms" } },
  { name: "items", attr: { kind: "struct[]", struct: "Item" } },
];

const mockPluginParams = {
  categorys: ["item", "weapon", "armor"],
  commandName: "Item Command",
  terms: {
    use: "Use Item",
    gain: "You gained {1}!",
    lose: "You lost {1}.",
  },
  items: [
    { name: "Potion", id: 1 },
    { name: "Hi-Potion", id: 2 },
  ],
} as const satisfies MockPluginParams;

const structsMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map<
  string,
  ClassifiedPluginParams
>([
  ["Item", schemaItem],
  ["Terms", schemaTerms],
]);

const paths: PluginValuesPathWithError[] = [
  {
    scalars: {
      category: "param",
      objectSchema: {},
      scalarArrays: [
        {
          param: {
            name: "categorys",
            attr: { default: [], kind: "string[]" },
          },
          path: "$.categorys[*]",
        },
      ],
      scalarsPath: undefined,
      name: "categorys",
    },
    structArrays: { errors: [], items: [] },
    structs: { errors: [], items: [] },
  },
  {
    scalars: {
      category: "param",
      objectSchema: { commandName: { default: "", kind: "string" } },
      scalarArrays: [],
      scalarsPath: '$["commandName"]',
      name: "commandName",
    },
    structArrays: { errors: [], items: [] },
    structs: { errors: [], items: [] },
  },
  {
    scalars: {
      category: "param",
      objectSchema: {},
      scalarArrays: [],
      scalarsPath: undefined,
      name: "terms",
    },
    structArrays: { errors: [], items: [] },
    structs: {
      errors: [],
      items: [
        {
          category: "struct",
          objectSchema: {
            gain: { default: "", kind: "string" },
            lose: { default: "", kind: "string" },
            use: { default: "", kind: "string" },
          },
          scalarArrays: [],
          scalarsPath: '$.terms["use","gain","lose"]',
          name: "Terms",
        },
      ],
    },
  },
  {
    scalars: {
      category: "param",
      objectSchema: {},
      scalarArrays: [],
      scalarsPath: undefined,
      name: "items",
    },
    structArrays: {
      errors: [],
      items: [
        {
          category: "struct",
          objectSchema: {
            id: { default: 0, kind: "number" },
            name: { default: "", kind: "string" },
          },
          scalarArrays: [],
          scalarsPath: '$.items[*]["name","id"]',
          name: "Item",
        },
      ],
    },
    structs: { errors: [], items: [] },
  },
];

describe("createPluginValuesPath for params", () => {
  test("creates correct path for string array parameter", () => {
    const expected: typeof result = {
      rootCategory: "param",
      rootName: "MockPluginParams",
      scalars: {
        scalarsPath: undefined,
        name: "",
        objectSchema: {},
        scalarArrays: [
          {
            param: {
              attr: { default: [], kind: "string[]" },
              name: "categorys",
            },
            path: '$["categorys"][*]',
          },
        ],
      },
      structArrays: { errors: [], items: [] },
      structs: { errors: [], items: [] },
    };
    const result = createPluginValuesPath(
      "param",
      "MockPluginParams",
      paramsSchema[0],
      structsMap,
    );
    expect(result.rootCategory).toBe("param");
    expect(result.rootName).toBe("MockPluginParams");
    expect(result).toEqual(expected);
  });

  test("creates correct path for string parameter", () => {
    const expected: typeof result = {
      rootCategory: "param",
      rootName: "MockPluginParams",
      scalars: {
        scalarsPath: '$["commandName"]',
        objectSchema: { commandName: { default: "", kind: "string" } },
        name: "string",
        scalarArrays: [],
      },
      structs: { errors: [], items: [] },
      structArrays: { errors: [], items: [] },
    };

    const result = createPluginValuesPath(
      "param",
      "MockPluginParams",
      paramsSchema[1],
      structsMap,
    );
    expect(result).toEqual(expected);
  });

  test("creates correct path for struct parameter", () => {
    const result = createPluginValuesPath(
      "param",
      "MockPluginParams",
      paramsSchema[2],
      structsMap,
    );

    expect(result.rootCategory).toBe("param");
    expect(result.structs.items).toHaveLength(1);
    expect(result.structs.items[0].name).toBe("Terms");
    expect(result.structs.items[0].scalarsPath).toMatch(/terms/);
    expect(result.structs.items[0].objectSchema).toEqual({
      gain: { default: "", kind: "string" },
      lose: { default: "", kind: "string" },
      use: { default: "", kind: "string" },
    });
  });

  test("creates correct path for struct array parameter", () => {
    const result = createPluginValuesPath(
      "param",
      "MockPluginParams",
      paramsSchema[3],
      structsMap,
    );

    expect(result.rootCategory).toBe("param");
    expect(result.structArrays.items).toHaveLength(1);
    expect(result.structArrays.items[0].name).toBe("Item");
    expect(result.structArrays.items[0].scalarsPath).toMatch(/items/);
    expect(result.structArrays.items[0].objectSchema).toEqual({
      id: { default: 0, kind: "number" },
      name: { default: "", kind: "string" },
    });
  });

  test("correctly handles all parameters in schema", () => {
    type Expected = Partial<PluginValuesPathWithError> & {
      rootCategory: string;
      rootName: string;
    };
    const expected1: Expected = {
      rootCategory: "param",
      rootName: "MockPluginParams",
      scalars: {
        name: "",
        objectSchema: {},
        scalarArrays: [
          {
            param: {
              attr: {
                default: [],
                kind: "string[]",
              },
              name: "categorys",
            },
            path: '$["categorys"][*]',
          },
        ],
        scalarsPath: undefined,
      },
      structArrays: {
        errors: [],
        items: [],
      },
      structs: {
        errors: [],
        items: [],
      },
    };

    const expected2: Expected = {
      rootCategory: "param",
      rootName: "MockPluginParams",
      scalars: {
        name: "string",
        objectSchema: {
          commandName: {
            default: "",
            kind: "string",
          },
        },
        scalarArrays: [],
        scalarsPath: '$["commandName"]',
      },
      structArrays: { errors: [], items: [] },
      structs: { errors: [], items: [] },
    };

    const expected3: Expected = {
      rootCategory: "param",
      rootName: "terms",
      structArrays: {
        errors: [],
        items: [],
      },
      structs: {
        errors: [],
        items: [
          {
            category: "struct",
            name: "Terms",
            objectSchema: {
              gain: { default: "", kind: "string" },
              lose: { default: "", kind: "string" },
              use: { default: "", kind: "string" },
            },
            scalarArrays: [],
            scalarsPath: '$["terms"]["use","gain","lose"]',
          },
        ],
      },
    };

    const results = paramsSchema.map((param) =>
      createPluginValuesPath("param", "MockPluginParams", param, structsMap),
    );

    expect(results).toHaveLength(4);
    expect(results[0]).toEqual(expected1);
    expect(results[1]).toEqual(expected2);
    expect(results[2]).toEqual(expected3);
  });

  test("maintains root information in all paths", () => {
    paramsSchema.forEach((param, index) => {
      const result = createPluginValuesPath(
        "param",
        "MockPluginParams",
        param,
        structsMap,
      );

      expect(result.rootCategory).toBe("param");
      if (index < 2) {
        // scalar and array parameters maintain the passed rootName
        expect(result.rootName).toBe("MockPluginParams");
      } else {
        // struct parameters use the parameter name as rootName
        expect(result.rootName).toBe(param.name);
      }
    });
  });

  test("correctly resolves nested struct schemas", () => {
    const termsResult = createPluginValuesPath(
      "param",
      "MockPluginParams",
      paramsSchema[2],
      structsMap,
    );

    const itemsResult = createPluginValuesPath(
      "param",
      "MockPluginParams",
      paramsSchema[3],
      structsMap,
    );

    // Terms struct should contain all three string fields
    expect(Object.keys(termsResult.structs.items[0].objectSchema)).toHaveLength(
      3,
    );
    // Item struct should contain name and id
    expect(
      Object.keys(itemsResult.structArrays.items[0].objectSchema),
    ).toHaveLength(2);
  });
});
