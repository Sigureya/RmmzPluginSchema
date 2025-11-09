import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginCommandSchemaArrayEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  buildCommandPathSchema,
  collectPluginValues,
  createCommandArgsPath,
} from "./command";
import type { CommandMemoItem } from "./value/types/JSONPathTypes";
import type {
  StructPropertysPath,
  StructPathResult,
  CommandPath,
} from "./value/types/pathSchemaTypes";
import type { PluginValues } from "./value/types/result";

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
  structName: "Command<Action>",
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
      structName: "Damage",
      objectSchema: { exprFunc: { default: "", kind: "string" } },
      scalarArrays: [],
      scalars: '$.damage["exprFunc"]',
    },
    {
      structName: "Message",
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
      structName: "Effect",
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
    const expected: CommandPath = {
      scalars: scalarsPath,
      structArrays: structArrays,
      structs: structsPath,
    };
    const result: CommandPath = createCommandArgsPath(
      commandAction,
      structsMap
    );
    expect(result.scalars).toEqual(expected.scalars);
    expect(result.structs).toEqual(expected.structs);
    expect(result.structArrays).toEqual(expected.structArrays);
    expect(result).toEqual(expected);
  });

  test("buildCommandPathSchema", () => {
    const commandMemo: CommandMemoItem[] = buildCommandPathSchema({
      scalars: scalarsPath,
      structArrays: structArrays,
      structs: structsPath,
    });
    expect(commandMemo).lengthOf(5);
    expect(commandMemo[0].schema).toBe(scalarsPath);
    expect(commandMemo[1].schema).toBe(scalarsPath);
    expect(commandMemo[2].schema).toBe(structsPath.items[0]);
    expect(commandMemo[3].schema).toBe(structsPath.items[1]);
    expect(commandMemo[4].schema).toBe(structArrays.items[0]);
  });

  test("collectScalaPathResults", () => {
    const expected: PluginValues[] = [
      {
        // TODO:プラグインコマンド直下にある値の扱い方
        structName: "Command<Action>",
        value: 1,
        param: { attr: { default: 0, kind: "number" }, name: "subject" },
      },
      {
        structName: "Damage",
        value: "a + b",
        param: { attr: { default: "", kind: "string" }, name: "exprFunc" },
      },
      {
        structName: "Message",
        value: "Hit!",
        param: { attr: { default: "", kind: "string" }, name: "success" },
      },
      {
        structName: "Message",
        value: "Miss!",
        param: { attr: { default: "", kind: "string" }, name: "failure" },
      },
      {
        structName: "Effect",
        value: 10,
        param: { attr: { default: 0, kind: "number" }, name: "code" },
      },
      {
        structName: "Effect",
        value: 100,
        param: { attr: { default: 0, kind: "number" }, name: "value" },
      },
      {
        structName: "Effect",
        value: 20,
        param: { attr: { default: 0, kind: "number" }, name: "code" },
      },
      {
        structName: "Effect",
        value: 200,
        param: { attr: { default: 0, kind: "number" }, name: "value" },
      },
    ];

    const commandMemo: CommandMemoItem[] = buildCommandPathSchema({
      scalars: scalarsPath,
      structArrays: structArrays,
      structs: structsPath,
    });

    const result: PluginValues[] = collectPluginValues(mockData, commandMemo);
    expect(result).toEqual(expected);
  });
});
