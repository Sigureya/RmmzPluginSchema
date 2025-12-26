import { describe, test, expect, vi } from "vitest";
import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import {
  compilePluginCommandExtractor,
  extractPluginCommandArgs,
} from "./command";
import type {
  PluginValues,
  CommandExtractResult,
  CommandArgExtractors,
} from "./extractor/types";

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
  damage: { exprFunc: "a  b", landomTable: [201, 211, 233] },
  message: { success: "Hit!", failure: "Miss!" },
} as const satisfies Action;

const emptyReader = (): JSONPathReader => ({
  find: () => [],
  pathSegments: () => [],
});

describe("command extractor", () => {
  const schema: PluginCommandSchemaArray = {
    command: "Action",
    args: [
      { name: "subject", attr: { kind: "number", default: 0 } },
      { name: "targets", attr: { kind: "number[]", default: [] } },
      { name: "damage", attr: { kind: "struct", struct: "Damage" } },
      { name: "effects", attr: { kind: "struct[]", struct: "Effect" } },
      { name: "message", attr: { kind: "struct", struct: "Message" } },
    ],
  };

  test("create memo", () => {
    const mockFn = vi.fn<(path: string) => JSONPathReader>(() => {
      return emptyReader();
    });
    compilePluginCommandExtractor("PluginName", schema, structsMap, mockFn);
    expect(mockFn).toHaveBeenCalledTimes(5);
    expect(mockFn).toHaveBeenNthCalledWith(1, `$["subject"]`);
    expect(mockFn).toHaveBeenNthCalledWith(2, `$["targets"][*]`);
    expect(mockFn).toHaveBeenNthCalledWith(3, '$["damage"]["exprFunc"]');
    expect(mockFn).toHaveBeenNthCalledWith(
      4,
      '$["effects"][*]["code","value"]'
    );
    expect(mockFn).toHaveBeenNthCalledWith(
      5,
      '$["message"]["success","failure"]'
    );
  });

  test("extract values", () => {
    const values: PluginValues[] = [
      {
        structName: "",
        param: {
          attr: { default: 0, kind: "number" },
          name: "subject",
        },
        rootName: "Action",
        rootType: "args",
        value: 1,
      },
      {
        structName: "",
        param: {
          attr: { default: [], kind: "number[]" },
          name: "targets",
        },
        rootName: "Action",
        rootType: "args",
        value: 2,
      },
      {
        structName: "",
        param: {
          attr: { default: [], kind: "number[]" },
          name: "targets",
        },
        rootName: "Action",
        rootType: "args",
        value: 3,
      },
      {
        structName: "Damage",
        param: {
          attr: { default: "", kind: "string" },
          name: "exprFunc",
        },
        rootName: "damage",
        rootType: "args",
        value: "a  b",
      },
      {
        structName: "Effect",
        param: {
          attr: { default: 0, kind: "number" },
          name: "code",
        },
        rootName: "effects",
        rootType: "args",
        value: 10,
      },
      {
        structName: "Effect",
        param: {
          attr: { default: 0, kind: "number" },
          name: "value",
        },
        rootName: "effects",
        rootType: "args",
        value: 100,
      },
      {
        structName: "Effect",
        param: {
          attr: { default: 0, kind: "number" },
          name: "code",
        },
        rootName: "effects",
        rootType: "args",
        value: 20,
      },
      {
        structName: "Effect",
        param: {
          attr: { default: 0, kind: "number" },
          name: "value",
        },
        rootName: "effects",
        rootType: "args",
        value: 200,
      },
      {
        structName: "Message",
        param: {
          attr: { default: "", kind: "string" },
          name: "success",
        },
        rootName: "message",
        rootType: "args",
        value: "Hit!",
      },
      {
        structName: "Message",
        param: {
          attr: { default: "", kind: "string" },
          name: "failure",
        },
        rootName: "message",
        rootType: "args",
        value: "Miss!",
      },
    ];

    const memo = compilePluginCommandExtractor(
      "",
      schema,
      structsMap,
      (path) => {
        return new JSONPathJS(path);
      }
    );
    const result = extractPluginCommandArgs(mockData, memo);
    expect(result.args).toEqual(values);
  });
});

describe("", () => {
  const schema: PluginCommandSchemaArray = {
    command: "Action",
    args: [
      {
        name: "message",
        attr: { kind: "struct", struct: "Message" },
      },
    ],
  };
  test("create memo", () => {
    const mockFn = vi.fn((path) => {
      return new JSONPathJS(path);
    });
    compilePluginCommandExtractor("", schema, structsMap, mockFn);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenNthCalledWith(
      1,
      '$["message"]["success","failure"]'
    );
  });

  test("extract values", () => {
    const memo: CommandArgExtractors = compilePluginCommandExtractor(
      "PluginName",
      schema,
      structsMap,
      (paht) => new JSONPathJS(paht)
    );
    const values: PluginValues[] = [
      {
        structName: "Message",
        param: {
          attr: { default: "", kind: "string" },
          name: "success",
        },
        rootName: "message",
        rootType: "args",
        value: "Hit!",
      },
      {
        structName: "Message",
        param: {
          attr: { default: "", kind: "string" },
          name: "failure",
        },
        rootName: "message",
        rootType: "args",
        value: "Miss!",
      },
    ];
    const result: CommandExtractResult = extractPluginCommandArgs(
      mockData,
      memo
    );
    expect(result.args).toEqual(values);
    expect(result.pluginName).toBe("PluginName");
    expect(result.commandName).toBe("Action");
  });
});
