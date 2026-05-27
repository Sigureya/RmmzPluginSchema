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
import type {
  CommandExtractError,
  CommandExtractMessageHandlers,
  PluginExtractedValue,
} from "./core";
import {
  extractArgsFromPluiginCommand,
  jsonPathFromPluginSchema,
  mergeCommandMap,
} from "./top";

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
  description: "top v2 test",
  parameters: {
    count: "10",
    title: "Hero",
  },
};

const createCommandMap = () => {
  const converted = jsonPathFromPluginSchema(schema, record, (jsonPath) => {
    return new JSONPathJS(jsonPath);
  });
  return mergeCommandMap([converted]);
};

describe("top v2 command extraction", () => {
  test("正常系: 定義済みコマンドはerrorなしで抽出できる", () => {
    const commandMap = createCommandMap();
    const command: PluginCommandData = {
      code: 357,
      parameters: ["MockPlugin", "Add", "Add", { value: "42", note: "ok" }],
    };

    const expectedArgs: PluginExtractedValue[] = [
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
    ];

    const extracted = extractArgsFromPluiginCommand(command, commandMap);

    expect(extracted.error).toBeUndefined();
    expect(extracted.pluginName).toBe("MockPlugin");
    expect(extracted.commandName).toBe("Add");
    expect(extracted.args).toEqual(expectedArgs);
  });

  test("異常系: 未定義コマンドはerror付きで返る", () => {
    const commandMap = createCommandMap();
    const command: PluginCommandData = {
      code: 357,
      parameters: ["MockPlugin", "Unknown", "Unknown", {}],
    };
    const error: CommandExtractError = {
      source: "undefinedCommand",
      message: "undefined command: MockPlugin:Unknown",
    };

    const extracted = extractArgsFromPluiginCommand(command, commandMap);

    expect(extracted.args).toEqual([]);
    expect(extracted.error).toBeDefined();
    expect(extracted.error).toEqual(error);
  });

  test("異常系: handlers を差し替えるとerror内容を上書きできる", () => {
    const commandMap = createCommandMap();
    const command: PluginCommandData = {
      code: 357,
      parameters: ["RemovedPlugin", "Unknown", "UnknownTitle", {}],
    };
    const expectedError: CommandExtractError = {
      message: "error message!",
      source: "source!",
    };
    const handlers: CommandExtractMessageHandlers = {
      undefinedCommand: () => expectedError,
      deepJSONParseError: () => ({
        source: "deepJSONParseError",
        message: "custom parse error",
      }),
      extractArgsError: () => ({
        source: "extractArgsError",
        message: "custom extract args error",
      }),
    };

    const extracted = extractArgsFromPluiginCommand(
      command,
      commandMap,
      handlers,
    );
    expect(extracted.commandName).toBe("Unknown");
    expect(extracted.pluginName).toBe("RemovedPlugin");
    expect(extracted.args).toEqual([]);
    expect(extracted.error).toEqual(expectedError);
  });
});
