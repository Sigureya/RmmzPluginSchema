import { describe, expect, test } from "vitest";
import type {
  PluginArrayParamType,
  PluginMinimumSchema,
  PluginParamsRecord,
  PluginScalarParam,
  PluginSchemaOf,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginCommandData } from "@RmmzPluginSchema/rmmz/plugin/types/pluginCommand";
import { JSONPathJS } from "jsonpath-js";
import {
  extractArgsFromPluiginCommand,
  jsonPathFromPluginSchema,
  mergeCommandMap,
} from "./plugin";

const minimumSchema: PluginMinimumSchema = {
  pluginName: "MockPlugin",
  schema: {
    commands: [
      {
        command: "Add",
        args: [
          { name: "value", attr: { kind: "number", default: 0 } },
          { name: "note", attr: { kind: "string", default: "" } },
        ],
      },
    ],
    structs: [],
  },
};

const schema: PluginSchemaOf<PluginScalarParam, PluginArrayParamType> = {
  ...minimumSchema,
  schema: {
    ...minimumSchema.schema,
    params: [
      { name: "count", attr: { kind: "number", default: 0 } },
      { name: "title", attr: { kind: "string", default: "" } },
    ],
  },
};

const record: PluginParamsRecord = {
  name: "MockPlugin",
  status: true,
  description: "jsonPathFromPluginSchema test",
  parameters: {
    count: "10",
    title: "Hero",
  },
};

describe("jsonPathFromPluginSchema", () => {
  test("引数から生成した抽出結果を戻り値として返す", () => {
    const result = jsonPathFromPluginSchema(schema, record, (jsonPath) => {
      return new JSONPathJS(jsonPath);
    });

    expect(result.schema).toBe(schema);
    expect(result.record).toBe(record);
    expect(result.params).toEqual([
      {
        rootType: "param",
        rootName: "count",
        structName: "",
        param: { name: "count", attr: { kind: "number", default: 0 } },
        value: 10,
      },
      {
        rootType: "param",
        rootName: "title",
        structName: "",
        param: { name: "title", attr: { kind: "string", default: "" } },
        value: "Hero",
      },
    ]);
    expect(result.extractorEntries).toHaveLength(1);
  });

  test("戻り値のextractorEntriesでコマンド引数を抽出できる", () => {
    const result = jsonPathFromPluginSchema(schema, record, (jsonPath) => {
      return new JSONPathJS(jsonPath);
    });
    const commandMap = mergeCommandMap([result]);

    const command: PluginCommandData = {
      code: 357,
      parameters: ["MockPlugin", "Add", "Add", { value: "42", note: "ok" }],
    };

    const extracted = extractArgsFromPluiginCommand(command, commandMap);
    expect(extracted.error).toBeUndefined();
    expect(extracted).toEqual({
      pluginName: "MockPlugin",
      commandName: "Add",
      args: [
        {
          rootType: "args",
          rootName: "Add",
          structName: "",
          param: { name: "value", attr: { kind: "number", default: 0 } },
          value: 42,
        },
        {
          rootType: "args",
          rootName: "Add",
          structName: "",
          param: { name: "note", attr: { kind: "string", default: "" } },
          value: "ok",
        },
      ],
    });
  });

  test("未定義コマンドはerror付き結果を返す", () => {
    const result = jsonPathFromPluginSchema(schema, record, (jsonPath) => {
      return new JSONPathJS(jsonPath);
    });
    const commandMap = mergeCommandMap([result]);

    const command: PluginCommandData = {
      code: 357,
      parameters: ["MockPlugin", "Unknown", "Unknown", {}],
    };

    const extracted = extractArgsFromPluiginCommand(command, commandMap);
    expect(extracted.error).toBeDefined();
    expect(extracted.error?.source).toBe("undefinedCommand");
    expect(extracted.args).toEqual([]);
  });
});
