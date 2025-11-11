import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginCommandSchemaArrayEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  StructPropertysPath,
  StructPathResult,
  PluginValuesPath,
} from "./core";
import type { PluginValues } from "./core/memo2/types/array";
import type { PluginValuesPathMemo } from "./core/memo2/types/memo";
import {
  buildPluginValuesPathSchema,
  collectPluginValues,
  createCommandArgsPath,
} from "./pluginValue";

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

const scalarsPath: StructPropertysPath = {
  name: "Action",
  category: "command",
  objectSchema: {
    subject: { default: 0, kind: "number" },
  },
  scalarArrays: [
    {
      param: { attr: { default: [], kind: "number[]" }, name: "targets" },
      path: "$.targets[*]",
    },
  ],
  scalars: '$["subject"]',
};

const structsPath: StructPathResult = {
  errors: [],
  items: [
    {
      category: "struct",
      name: "Damage",
      objectSchema: { exprFunc: { default: "", kind: "string" } },
      scalarArrays: [],
      scalars: '$.damage["exprFunc"]',
    },
    {
      category: "struct",
      name: "Message",
      objectSchema: {
        failure: { default: "", kind: "string" },
        success: { default: "", kind: "string" },
      },
      scalarArrays: [],
      scalars: '$.message["success","failure"]',
    },
  ],
};

const structArrays: StructPathResult = {
  errors: [],
  items: [
    {
      category: "struct",
      name: "Effect",
      objectSchema: {
        code: { default: 0, kind: "number" },
        value: { default: 0, kind: "number" },
      },
      scalarArrays: [],
      scalars: '$.effects[*]["code","value"]',
    },
  ],
};

describe("command", () => {
  test("createCommandArgsPath", () => {
    const expected: PluginValuesPath = {
      scalars: scalarsPath,
      structArrays: structArrays,
      structs: structsPath,
    };
    const result: PluginValuesPath = createCommandArgsPath(
      commandAction,
      structsMap
    );
    expect(result.scalars).toEqual(expected.scalars);
    expect(result.structs).toEqual(expected.structs);
    expect(result.structArrays).toEqual(expected.structArrays);
    expect(result).toEqual(expected);
  });

  test.skip("buildCommandPathSchema", () => {
    const commandMemo: PluginValuesPathMemo[] = buildPluginValuesPathSchema({
      scalars: scalarsPath,
      structArrays: structArrays,
      structs: structsPath,
    });
    expect(commandMemo).toEqual([]);
    // expect(commandMemo).lengthOf(5);
    // expect(commandMemo[0].schema).toBe(scalarsPath);
    // expect(commandMemo[1].schema).toBe(scalarsPath);
    // expect(commandMemo[2].schema).toBe(structsPath.items[0]);
    // expect(commandMemo[3].schema).toBe(structsPath.items[1]);
    // expect(commandMemo[4].schema).toBe(structArrays.items[0]);
  });

  test.skip("collectScalaPathResults", () => {
    const expected: PluginValues[] = [
      {
        category: "command",
        name: "Action",
        value: 1,
        param: { attr: { default: 0, kind: "number" }, name: "subject" },
      },
      {
        category: "command",
        name: "Action",
        value: 2,
        param: { attr: { default: [], kind: "number[]" }, name: "targets" },
      },
      {
        category: "command",
        name: "Action",
        value: 3,
        param: { attr: { default: [], kind: "number[]" }, name: "targets" },
      },
      {
        category: "struct",
        name: "Damage",
        value: "a + b",
        param: { attr: { default: "", kind: "string" }, name: "exprFunc" },
      },
      {
        category: "struct",
        name: "Damage",
        value: 201,
        param: { attr: { default: [], kind: "number[]" }, name: "landomTable" },
      },
      {
        category: "struct",
        name: "Damage",
        value: 211,
        param: { attr: { default: [], kind: "number[]" }, name: "landomTable" },
      },
      {
        category: "struct",
        name: "Damage",
        value: 233,
        param: { attr: { default: [], kind: "number[]" }, name: "landomTable" },
      },
      {
        category: "struct",
        name: "Message",
        value: "Hit!",
        param: { attr: { default: "", kind: "string" }, name: "success" },
      },
      {
        category: "struct",
        name: "Message",
        value: "Miss!",
        param: { attr: { default: "", kind: "string" }, name: "failure" },
      },
      {
        category: "struct",
        name: "Effect",
        value: 10,
        param: { attr: { default: 0, kind: "number" }, name: "code" },
      },
      {
        category: "struct",
        name: "Effect",
        value: 100,
        param: { attr: { default: 0, kind: "number" }, name: "value" },
      },
      {
        category: "struct",
        name: "Effect",
        value: 20,
        param: { attr: { default: 0, kind: "number" }, name: "code" },
      },
      {
        category: "struct",
        name: "Effect",
        value: 200,
        param: { attr: { default: 0, kind: "number" }, name: "value" },
      },
    ];

    const commandMemo: PluginValuesPathMemo[] = buildPluginValuesPathSchema({
      scalars: scalarsPath,
      structArrays: structArrays,
      structs: structsPath,
    });

    const result: PluginValues[] = collectPluginValues(mockData, commandMemo);
    expect(result).toEqual(expected);
  });
});
