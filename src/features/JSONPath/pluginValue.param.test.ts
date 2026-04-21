import { describe, expect, test } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginParam,
  PluginParamsRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import { stringifyDeepJSON } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type {
  PluginValuesPath,
  ParamExtractResult,
  PluginParamsSchema,
} from "./core";
import {
  compilePluginParamExtractor,
  createPluginValuesPath,
  extractPluginParamFromRecord,
} from "./core";

interface Item {
  name: string;
  id: number;
}

interface Class {
  name: string;
  maxLevel: number;
  expTable: number[];
}
interface Event {
  name: string;
  id: number;
  imngae: string[];
}

interface Audio {
  name: string;
  volume: number;
}

interface MapData {
  name: string;
  width: number;
  height: number;
  events: Event[];
  audio: Audio;
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

const schemaClass: ClassifiedPluginParamsEx<Class> = {
  scalars: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "maxLevel", attr: { kind: "number", default: 0 } },
  ],
  scalarArrays: [{ name: "expTable", attr: { kind: "number[]", default: [] } }],
  structArrays: [],
  structs: [],
};

const schemaEvent: ClassifiedPluginParamsEx<Event> = {
  scalars: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "id", attr: { kind: "number", default: 0 } },
  ],
  scalarArrays: [{ name: "imngae", attr: { kind: "string[]", default: [] } }],
  structArrays: [],
  structs: [],
};

const schemaAudio: ClassifiedPluginParamsEx<Audio> = {
  scalars: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "volume", attr: { kind: "number", default: 0 } },
  ],
  scalarArrays: [],
  structArrays: [],
  structs: [],
};

const schemaMapData: ClassifiedPluginParamsEx<MapData> = {
  scalars: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "width", attr: { kind: "number", default: 0 } },
    { name: "height", attr: { kind: "number", default: 0 } },
  ],
  scalarArrays: [],
  structArrays: [
    {
      name: "events",
      attr: {
        kind: "struct[]",
        struct: "Event",
      },
    },
  ],
  structs: [
    {
      name: "audio",
      attr: {
        kind: "struct",
        struct: "Audio",
      },
    },
  ],
};

const structsMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map<
  string,
  ClassifiedPluginParams
>([
  ["Item", schemaItem],
  ["Class", schemaClass],
  ["Event", schemaEvent],
  ["Audio", schemaAudio],
  ["MapData", schemaMapData],
]);

const itemParam: PluginParam = {
  name: "items",
  attr: { kind: "struct[]", struct: "Item" },
};

const classParam: PluginParam = {
  name: "class",
  attr: { kind: "struct", struct: "Class" },
};

const mapParam: PluginParam = {
  name: "map",
  attr: { kind: "struct", struct: "MapData" },
};

const titleBgmParam: PluginParam = {
  name: "titleBgm",
  attr: { kind: "struct", struct: "Audio" },
};

interface TestCase {
  caseName: string;
  path: PluginValuesPath;
  expected: ParamExtractResult;
  paramSchema: PluginParam;
}

const runTestCase = (testCase: TestCase, record2: PluginParamsRecord) => {
  describe(testCase.caseName, () => {
    const pluginSchema: PluginParamsSchema = {
      pluginName: "MockPlugin",
      schema: {
        params: [testCase.paramSchema],
      },
    };

    test("パスを適切に構築できるか", () => {
      const pathResult = createPluginValuesPath(
        "param",
        "MockPluginParams",
        testCase.paramSchema,
        structsMap,
      );

      expect(pathResult).toEqual(testCase.path);
    });

    test("値の取り出しは成功したか", () => {
      const memo = compilePluginParamExtractor(
        pluginSchema,
        structsMap,
        (jsonPath) => new JSONPathJS(jsonPath),
      );

      const result = extractPluginParamFromRecord(record2, memo.extractors);
      expect(result).toEqual(testCase.expected);
    });
  });
};

const testCases: TestCase[] = [
  {
    paramSchema: itemParam,
    caseName: "基本的な構造のテスト",
    path: {
      rootCategory: "param",
      rootName: "items",
      scalars: undefined,
      structArrays: {
        errors: [],
        items: [
          {
            category: "struct",
            name: "Item",
            objectSchema: {
              id: { kind: "number", default: 0 },
              name: { kind: "string", default: "" },
            },
            scalarArrays: [],
            scalarsPath: '$["items"][*]["name","id"]',
          },
        ],
      },
      structs: { errors: [], items: [] },
    },
    expected: {
      pluginName: "MockPlugin",
      params: [
        {
          rootType: "param",
          rootName: "items",
          structName: "Item",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Potion",
        },
        {
          rootType: "param",
          rootName: "items",
          structName: "Item",
          param: { name: "id", attr: { kind: "number", default: 0 } },
          value: 1,
        },
        {
          rootType: "param",
          rootName: "items",
          structName: "Item",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Hi-Potion",
        },
        {
          rootType: "param",
          rootName: "items",
          structName: "Item",
          param: { name: "id", attr: { kind: "number", default: 0 } },
          value: 2,
        },
      ],
    },
  },
  {
    paramSchema: classParam,
    caseName: "Class構造体と配列のテスト",
    path: {
      rootCategory: "param",
      rootName: "class",
      scalars: undefined,
      structArrays: { errors: [], items: [] },
      structs: {
        errors: [],
        items: [
          {
            category: "struct",
            name: "Class",
            objectSchema: {
              name: { kind: "string", default: "" },
              maxLevel: { kind: "number", default: 0 },
            },
            scalarArrays: [
              {
                param: {
                  name: "expTable",
                  attr: { kind: "number[]", default: [] },
                },
                path: '$["class"]["expTable"][*]',
              },
            ],
            scalarsPath: '$["class"]["name","maxLevel"]',
          },
        ],
      },
    },
    expected: {
      pluginName: "MockPlugin",
      params: [
        {
          rootType: "param",
          rootName: "class",
          structName: "Class",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Warrior",
        },
        {
          rootType: "param",
          rootName: "class",
          structName: "Class",
          param: { name: "maxLevel", attr: { kind: "number", default: 0 } },
          value: 99,
        },
        {
          rootType: "param",
          rootName: "class",
          structName: "Class",
          param: {
            name: "expTable",
            attr: { kind: "number[]", default: [] },
          },
          value: 0,
        },
        {
          rootType: "param",
          rootName: "class",
          structName: "Class",
          param: {
            name: "expTable",
            attr: { kind: "number[]", default: [] },
          },
          value: 100,
        },
        {
          rootType: "param",
          rootName: "class",
          structName: "Class",
          param: {
            name: "expTable",
            attr: { kind: "number[]", default: [] },
          },
          value: 300,
        },
      ],
    },
  },
  {
    paramSchema: mapParam,
    caseName: "MapDataのネスト構造テスト",
    path: {
      rootCategory: "param",
      rootName: "map",
      scalars: undefined,
      structArrays: { errors: [], items: [] },
      structs: {
        errors: [],
        items: [
          {
            category: "struct",
            name: "MapData",
            objectSchema: {
              name: { kind: "string", default: "" },
              width: { kind: "number", default: 0 },
              height: { kind: "number", default: 0 },
            },
            scalarArrays: [],
            scalarsPath: '$["map"]["name","width","height"]',
          },
          {
            category: "struct",
            name: "Audio",
            objectSchema: {
              name: { kind: "string", default: "" },
              volume: { kind: "number", default: 0 },
            },
            scalarArrays: [],
            scalarsPath: '$["map"]["audio"]["name","volume"]',
          },
          {
            category: "struct",
            name: "Event",
            objectSchema: {
              name: { kind: "string", default: "" },
              id: { kind: "number", default: 0 },
            },
            scalarArrays: [
              {
                param: {
                  name: "imngae",
                  attr: { kind: "string[]", default: [] },
                },
                path: '$["map"]["events"][*]["imngae"][*]',
              },
            ],
            scalarsPath: '$["map"]["events"][*]["name","id"]',
          },
        ],
      },
    },
    expected: {
      pluginName: "MockPlugin",
      params: [
        {
          rootType: "param",
          rootName: "map",
          structName: "MapData",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Test Map",
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "MapData",
          param: { name: "width", attr: { kind: "number", default: 0 } },
          value: 100,
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "MapData",
          param: { name: "height", attr: { kind: "number", default: 0 } },
          value: 100,
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "Audio",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Battle Theme",
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "Audio",
          param: { name: "volume", attr: { kind: "number", default: 0 } },
          value: 80,
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "Event",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Start Event",
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "Event",
          param: { name: "id", attr: { kind: "number", default: 0 } },
          value: 1,
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "Event",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Boss Event",
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "Event",
          param: { name: "id", attr: { kind: "number", default: 0 } },
          value: 2,
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "Event",
          param: { name: "imngae", attr: { kind: "string[]", default: [] } },
          value: "actor1",
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "Event",
          param: { name: "imngae", attr: { kind: "string[]", default: [] } },
          value: "face1",
        },
        {
          rootType: "param",
          rootName: "map",
          structName: "Event",
          param: { name: "imngae", attr: { kind: "string[]", default: [] } },
          value: "boss1",
        },
      ],
    },
  },
  {
    paramSchema: titleBgmParam,
    caseName: "Audio構造体の単体テスト",
    path: {
      rootCategory: "param",
      rootName: "titleBgm",
      scalars: undefined,
      structArrays: { errors: [], items: [] },
      structs: {
        errors: [],
        items: [
          {
            category: "struct",
            name: "Audio",
            objectSchema: {
              name: { kind: "string", default: "" },
              volume: { kind: "number", default: 0 },
            },
            scalarArrays: [],
            scalarsPath: '$["titleBgm"]["name","volume"]',
          },
        ],
      },
    },
    expected: {
      pluginName: "MockPlugin",
      params: [
        {
          rootType: "param",
          rootName: "titleBgm",
          structName: "Audio",
          param: { name: "name", attr: { kind: "string", default: "" } },
          value: "Title Theme",
        },
        {
          rootType: "param",
          rootName: "titleBgm",
          structName: "Audio",
          param: { name: "volume", attr: { kind: "number", default: 0 } },
          value: 70,
        },
      ],
    },
  },
];
describe("PluginParamExtractorのテスト", () => {
  const items: Item[] = [
    { name: "Potion", id: 1 },
    { name: "Hi-Potion", id: 2 },
  ];
  const map: MapData = {
    name: "Test Map",
    width: 100,
    height: 100,
    events: [
      { name: "Start Event", id: 1, imngae: ["actor1", "face1"] },
      { name: "Boss Event", id: 2, imngae: ["boss1"] },
    ],
    audio: { name: "Battle Theme", volume: 80 },
  };
  const titleBgm: Audio = { name: "Title Theme", volume: 70 };

  const record: PluginParamsRecord = {
    name: "MockPlugin",
    status: true,
    description: "integration test",
    parameters: {
      items: stringifyDeepJSON(items),
      class: stringifyDeepJSON({
        name: "Warrior",
        maxLevel: 99,
        expTable: [0, 100, 300],
      }),
      titleBgm: stringifyDeepJSON(titleBgm),
      map: stringifyDeepJSON(map),

      num: "123",
    },
  };
  testCases.forEach((testCase) => runTestCase(testCase, record));
});
