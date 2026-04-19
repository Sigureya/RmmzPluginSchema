import { describe, test, expect } from "vitest";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx,
  PluginCommandSchemaArrayEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPath } from "./core";
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

describe("createPluginValuesPath for command arguments", () => {
  test("creates correct path for number argument", () => {
    const result = createPluginValuesPath(
      "args",
      "Action",
      commandAction.args[0],
      structsMap,
    );

    expect(result.rootCategory).toBe("args");
    expect(result.rootName).toBe("Action");
    expect(result.scalars?.scalarsPath).toBe('$["subject"]');
    expect(result.scalars?.objectSchema).toEqual({
      subject: { default: 0, kind: "number" },
    });
  });

  test("creates correct path for number array argument", () => {
    const result = createPluginValuesPath(
      "args",
      "Action",
      commandAction.args[1],
      structsMap,
    );

    expect(result.rootCategory).toBe("args");
    expect(result.rootName).toBe("Action");
    expect(result.scalars?.scalarArrays).toHaveLength(1);
    expect(result.scalars?.scalarArrays[0].path).toBe('$["targets"][*]');
    expect(result.scalars?.scalarArrays[0].param.name).toBe("targets");
    expect(result.scalars?.scalarArrays[0].param.attr.kind).toBe("number[]");
  });

  test("creates correct path for damage struct", () => {
    const result = createPluginValuesPath(
      "args",
      "Action",
      commandAction.args[2],
      structsMap,
    );

    expect(result.rootCategory).toBe("args");
    expect(result.structs.items).toHaveLength(1);
    expect(result.structs.items[0].name).toBe("Damage");
    expect(result.structs.items[0].scalarsPath).toMatch(/damage/);
    expect(result.structs.items[0].objectSchema.exprFunc).toBeDefined();
  });

  test("creates correct path for effects struct array", () => {
    const result = createPluginValuesPath(
      "args",
      "Action",
      commandAction.args[3],
      structsMap,
    );

    expect(result.rootCategory).toBe("args");
    expect(result.structArrays.items).toHaveLength(1);
    expect(result.structArrays.items[0].name).toBe("Effect");
    expect(result.structArrays.items[0].scalarsPath).toMatch(/effects/);
    expect(result.structArrays.items[0].objectSchema).toEqual({
      code: { default: 0, kind: "number" },
      value: { default: 0, kind: "number" },
    });
  });

  test("creates correct path for message struct", () => {
    const result = createPluginValuesPath(
      "args",
      "Action",
      commandAction.args[4],
      structsMap,
    );

    expect(result.rootCategory).toBe("args");
    expect(result.structs.items).toHaveLength(1);
    expect(result.structs.items[0].name).toBe("Message");
    expect(result.structs.items[0].objectSchema).toEqual({
      failure: { default: "", kind: "string" },
      success: { default: "", kind: "string" },
    });
  });

  test("correctly processes all arguments in command schema", () => {
    const results = commandAction.args.map((arg) =>
      createPluginValuesPath("args", "Action", arg, structsMap),
    );

    expect(results).toHaveLength(5);
    // subject (scalar number)
    expect(results[0].scalars?.scalarsPath).toBeDefined();
    expect(results[0].rootCategory).toBe("args");
    // targets (scalar array)
    expect(results[1].scalars?.scalarArrays).toHaveLength(1);
    expect(results[1].rootCategory).toBe("args");
    // damage (struct)
    expect(results[2].structs.items).toHaveLength(1);
    expect(results[2].rootName).toBe("damage");
    // effects (struct array)
    expect(results[3].structArrays.items).toHaveLength(1);
    expect(results[3].rootName).toBe("effects");
    // message (struct)
    expect(results[4].structs.items).toHaveLength(1);
    expect(results[4].rootName).toBe("message");
  });

  test("maintains consistent root information across all arguments", () => {
    commandAction.args.forEach((arg, index) => {
      const result = createPluginValuesPath("args", "Action", arg, structsMap);

      expect(result.rootCategory).toBe("args");
      if (index < 2) {
        // scalar and array arguments maintain the passed rootName
        expect(result.rootName).toBe("Action");
        // scalar and array have scalars defined
        expect(result.scalars).toBeDefined();
      } else {
        // struct arguments use the argument name as rootName
        expect(result.rootName).toBe(arg.name);
      }
    });
  });

  test("correctly resolves nested struct definitions", () => {
    const damagePath = createPluginValuesPath(
      "args",
      "Action",
      commandAction.args[2],
      structsMap,
    );
    const effectsPath = createPluginValuesPath(
      "args",
      "Action",
      commandAction.args[3],
      structsMap,
    );
    const messagePath = createPluginValuesPath(
      "args",
      "Action",
      commandAction.args[4],
      structsMap,
    );

    // Damage should have exprFunc field
    expect(damagePath.structs.items[0].objectSchema).toHaveProperty("exprFunc");
    // Effect should have code and value fields
    expect(effectsPath.structArrays.items[0].objectSchema).toHaveProperty(
      "code",
    );
    expect(effectsPath.structArrays.items[0].objectSchema).toHaveProperty(
      "value",
    );
    // Message should have success and failure fields
    expect(messagePath.structs.items[0].objectSchema).toHaveProperty("success");
    expect(messagePath.structs.items[0].objectSchema).toHaveProperty("failure");
  });
});
