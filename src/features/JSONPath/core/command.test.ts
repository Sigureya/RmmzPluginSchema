import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginCommandSchemaArrayEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  buildCommandPathSchema,
  collectScalaPathResults,
  createCommandArgsPath,
} from "./command";
import type { CommandMemoItem } from "./value/types/JSONPathTypes";
import type {
  StructPropertysPath,
  StructPathResult,
  CommandPath,
} from "./value/types/pathSchemaTypes";
import type { ScalaPathResult } from "./value/types/result";

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
  scalas: [
    {
      name: "exprFunc",
      attr: { kind: "string", default: "" },
    },
  ],
  scalaArrays: [],
  structArrays: [],
  structs: [],
};

const schemaEffect: ClassifiedPluginParamsEx<Effect> = {
  scalas: [
    { name: "code", attr: { kind: "number", default: 0 } },
    { name: "value", attr: { kind: "number", default: 0 } },
  ],
  scalaArrays: [],
  structArrays: [],
  structs: [],
};

const schemaMessage: ClassifiedPluginParamsEx<Message> = {
  scalas: [
    { name: "success", attr: { kind: "string", default: "" } },
    { name: "failure", attr: { kind: "string", default: "" } },
  ],
  scalaArrays: [],
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
  structName: "Action",
  objectSchema: {
    subject: { default: 0, kind: "number" },
  },
  scalaArrays: [
    {
      param: { attr: { default: [], kind: "number[]" }, name: "targets" },
      path: "$.targets[*]",
    },
  ],
  scalas: '$["subject"]',
};

const structsPath: StructPathResult = {
  errors: [],
  items: [
    {
      structName: "Damage",
      objectSchema: { exprFunc: { default: "", kind: "string" } },
      scalaArrays: [],
      scalas: '$.damage["exprFunc"]',
    },
    {
      structName: "Message",
      objectSchema: {
        failure: { default: "", kind: "string" },
        success: { default: "", kind: "string" },
      },
      scalaArrays: [],
      scalas: '$.message["success","failure"]',
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
      scalaArrays: [],
      scalas: '$.effects[*]["code","value"]',
    },
  ],
};

describe("ccc", () => {
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
});

describe("memo", () => {
  test("buildCommandPathSchema", () => {
    const commandMemo: CommandMemoItem[] = buildCommandPathSchema({
      scalars: scalarsPath,
      structArrays: structArrays,
      structs: structsPath,
    });
    expect(commandMemo).lengthOf(5);
  });
  test("collectScalaPathResults", () => {
    const expected: ScalaPathResult[] = [
      {
        structName: "Action",
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

    const commandMemo = buildCommandPathSchema({
      scalars: scalarsPath,
      structArrays: structArrays,
      structs: structsPath,
    });

    const gg: ScalaPathResult[] = collectScalaPathResults(
      mockData,
      commandMemo
    );
    expect(gg).toEqual(expected);
  });
});
