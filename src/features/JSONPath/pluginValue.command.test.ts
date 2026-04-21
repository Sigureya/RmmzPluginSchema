import { describe, expect, test } from "vitest";
import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginCommandSchemaArrayEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type { CommandExtractResult, PluginValuesPath } from "./core";
import {
  compilePluginCommandExtractor,
  createPluginValuesPath,
  extractPluginCommandArgs,
} from "./core";

interface Effect {
  code: number;
  value: number;
}

interface Damage {
  exprFunc: string;
  landomTable: number[];
}

interface Message {
  success: string;
  failure: string;
}

interface Action {
  subject: number;
  targets: number[];
  effects: Effect[];
  damage: Damage;
  message: Message;
}

const schemaDamage: ClassifiedPluginParamsEx<Damage> = {
  scalars: [
    {
      name: "exprFunc",
      attr: { kind: "string", default: "" },
    },
  ],
  scalarArrays: [],
  structArrays: [],
  structs: [],
};

const schemaEffect: ClassifiedPluginParamsEx<Effect> = {
  scalars: [
    { name: "code", attr: { kind: "number", default: 0 } },
    { name: "value", attr: { kind: "number", default: 0 } },
  ],
  scalarArrays: [],
  structArrays: [],
  structs: [],
};

const schemaMessage: ClassifiedPluginParamsEx<Message> = {
  scalars: [
    { name: "success", attr: { kind: "string", default: "" } },
    { name: "failure", attr: { kind: "string", default: "" } },
  ],
  scalarArrays: [],
  structArrays: [],
  structs: [],
};

const commandAction: PluginCommandSchemaArrayEx<Action> = {
  command: "Action",
  args: [
    { name: "subject", attr: { kind: "number", default: 0 } },
    { name: "targets", attr: { kind: "number[]", default: [] } },
    { name: "damage", attr: { kind: "struct", struct: "Damage" } },
    { name: "effects", attr: { kind: "struct[]", struct: "Effect" } },
    { name: "message", attr: { kind: "struct", struct: "Message" } },
  ],
};

const structsMap: ReadonlyMap<string, ClassifiedPluginParams> = new Map<
  string,
  ClassifiedPluginParams
>([
  ["Damage", schemaDamage],
  ["Effect", schemaEffect],
  ["Message", schemaMessage],
]);

const mockData = {
  subject: 1,
  targets: [2, 3],
  effects: [
    { code: 10, value: 100 },
    { code: 20, value: 200 },
  ],
  damage: { exprFunc: "a + b", landomTable: [201, 211, 233] },
  message: { success: "Hit!", failure: "Miss!" },
} as const satisfies Action;

interface TestCase {
  caseName: string;
  paths: PluginValuesPath[];
  expected: CommandExtractResult;
  commandSchema: PluginCommandSchemaArrayEx<Action>;
}

const runTestCase = <T extends Record<string, JSONValue>>(
  testCase: TestCase,
  value: T,
) => {
  describe(testCase.caseName, () => {
    test("パスを適切に構築できるか", () => {
      const pathResult = testCase.commandSchema.args.map((arg) =>
        createPluginValuesPath(
          "args",
          testCase.commandSchema.command,
          arg,
          structsMap,
        ),
      );

      expect(pathResult).toEqual(testCase.paths);
    });

    test("値の取り出しは成功したか", () => {
      const extractor = compilePluginCommandExtractor(
        "MockPlugin",
        testCase.commandSchema,
        structsMap,
        (jsonPath) => new JSONPathJS(jsonPath),
      );

      const result = extractPluginCommandArgs(value, extractor);
      expect(result).toEqual(testCase.expected);
    });
  });
};

const testCases: TestCase[] = [
  {
    caseName: "Actionコマンドの統合テスト",
    commandSchema: commandAction,
    paths: [
      {
        rootCategory: "args",
        rootName: "Action",
        scalars: {
          name: "number",
          category: undefined,
          objectSchema: {
            subject: { kind: "number", default: 0 },
          },
          scalarArrays: [],
          scalarsPath: '$["subject"]',
        },
        structs: { errors: [], items: [] },
        structArrays: { errors: [], items: [] },
      },
      {
        rootCategory: "args",
        rootName: "Action",
        scalars: {
          name: "",
          category: undefined,
          objectSchema: {},
          scalarArrays: [
            {
              param: {
                name: "targets",
                attr: { kind: "number[]", default: [] },
              },
              path: '$["targets"][*]',
            },
          ],
          scalarsPath: undefined,
        },
        structs: { errors: [], items: [] },
        structArrays: { errors: [], items: [] },
      },
      {
        rootCategory: "args",
        rootName: "damage",
        scalars: undefined,
        structs: {
          errors: [],
          items: [
            {
              category: "struct",
              name: "Damage",
              objectSchema: { exprFunc: { kind: "string", default: "" } },
              scalarArrays: [],
              scalarsPath: '$["damage"]["exprFunc"]',
            },
          ],
        },
        structArrays: { errors: [], items: [] },
      },
      {
        rootCategory: "args",
        rootName: "effects",
        scalars: undefined,
        structs: { errors: [], items: [] },
        structArrays: {
          errors: [],
          items: [
            {
              category: "struct",
              name: "Effect",
              objectSchema: {
                code: { kind: "number", default: 0 },
                value: { kind: "number", default: 0 },
              },
              scalarArrays: [],
              scalarsPath: '$["effects"][*]["code","value"]',
            },
          ],
        },
      },
      {
        rootCategory: "args",
        rootName: "message",
        scalars: undefined,
        structs: {
          errors: [],
          items: [
            {
              category: "struct",
              name: "Message",
              objectSchema: {
                success: { kind: "string", default: "" },
                failure: { kind: "string", default: "" },
              },
              scalarArrays: [],
              scalarsPath: '$["message"]["success","failure"]',
            },
          ],
        },
        structArrays: { errors: [], items: [] },
      },
    ],
    expected: {
      pluginName: "MockPlugin",
      commandName: "Action",
      args: [
        {
          rootType: "args",
          rootName: "Action",
          structName: "",
          param: { name: "subject", attr: { kind: "number", default: 0 } },
          value: 1,
        },
        {
          rootType: "args",
          rootName: "Action",
          structName: "",
          param: { name: "targets", attr: { kind: "number[]", default: [] } },
          value: 2,
        },
        {
          rootType: "args",
          rootName: "Action",
          structName: "",
          param: { name: "targets", attr: { kind: "number[]", default: [] } },
          value: 3,
        },
        {
          rootType: "args",
          rootName: "damage",
          structName: "Damage",
          param: { name: "exprFunc", attr: { kind: "string", default: "" } },
          value: "a + b",
        },
        {
          rootType: "args",
          rootName: "effects",
          structName: "Effect",
          param: { name: "code", attr: { kind: "number", default: 0 } },
          value: 10,
        },
        {
          rootType: "args",
          rootName: "effects",
          structName: "Effect",
          param: { name: "value", attr: { kind: "number", default: 0 } },
          value: 100,
        },
        {
          rootType: "args",
          rootName: "effects",
          structName: "Effect",
          param: { name: "code", attr: { kind: "number", default: 0 } },
          value: 20,
        },
        {
          rootType: "args",
          rootName: "effects",
          structName: "Effect",
          param: { name: "value", attr: { kind: "number", default: 0 } },
          value: 200,
        },
        {
          rootType: "args",
          rootName: "message",
          structName: "Message",
          param: { name: "success", attr: { kind: "string", default: "" } },
          value: "Hit!",
        },
        {
          rootType: "args",
          rootName: "message",
          structName: "Message",
          param: { name: "failure", attr: { kind: "string", default: "" } },
          value: "Miss!",
        },
      ],
    },
  },
];

describe("PluginCommandExtractorのテスト", () => {
  testCases.forEach((testCase) => runTestCase(testCase, mockData));
});
