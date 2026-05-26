import { describe, expect, test } from "vitest";
import type {
  PluginArrayParamType,
  PluginMinimumSchema,
  PluginCommandData,
  PluginParamsRecord,
  PluginScalarParam,
  PluginSchemaOf,
} from "@RmmzPluginSchema/rmmz/plugin";
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
});
