import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginCommandSchemaArrayEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { StructPropertysPathOld, StructPathResultWithError } from "./core";

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

const scalarsPath: StructPropertysPathOld = {
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
  scalarsPath: '$["subject"]',
};

const structsPath: StructPathResultWithError = {
  errors: [],
  items: [
    {
      category: "struct",
      name: "Damage",
      objectSchema: { exprFunc: { default: "", kind: "string" } },
      scalarArrays: [],
      scalarsPath: '$.damage["exprFunc"]',
    },
    {
      category: "struct",
      name: "Message",
      objectSchema: {
        failure: { default: "", kind: "string" },
        success: { default: "", kind: "string" },
      },
      scalarArrays: [],
      scalarsPath: '$.message["success","failure"]',
    },
  ],
};

const structArrays: StructPathResultWithError = {
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
      scalarsPath: '$.effects[*]["code","value"]',
    },
  ],
};

test.skip("", () => {});
