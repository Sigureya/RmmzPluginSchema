import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginStructParamTypeEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesPathWithError } from "./core";

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
      scalars: undefined,
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
      scalars: '$["commandName"]',
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
      scalars: undefined,
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
          scalars: '$.terms["use","gain","lose"]',
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
      scalars: undefined,
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
          scalars: '$.items[*]["name","id"]',
          name: "Item",
        },
      ],
    },
    structs: { errors: [], items: [] },
  },
];

describe("createPluginParamsPath", () => {
  test.skip("", () => {});
});
