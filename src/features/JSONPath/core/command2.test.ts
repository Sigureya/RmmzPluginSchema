import { describe, expect, test, vi } from "vitest";
import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandData,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { compilePluginCommandExtractor } from "./command";
import { extractArgsFromPluginCommandHandled } from "./command2";
import type {
  CommandArgExtractors,
  CommandExtractError,
  CommandExtractMessageHandlers,
  CommandMapKey,
} from "./extractor/types";

const handlers: CommandExtractMessageHandlers = {
  undefinedCommand: (command) => ({
    message: `undefined command: ${command.parameters[0]}:${command.parameters[1]}`,
    source: "undefinedCommand",
  }),
  deepJSONParseError: (command, error) => ({
    message: `parse failed: ${command.parameters[0]}:${command.parameters[1]}:${String(error)}`,
    source: "deepJSONParseError",
  }),
};

const createCommand = (
  pluginName: string,
  commandName: string,
  args: Record<string, string>,
): PluginCommandData => ({
  code: 357,
  parameters: [pluginName, commandName, commandName, args],
});

describe("command2 handled extraction", () => {
  const commandSchema: PluginCommandSchemaArray = {
    command: "Add",
    args: [{ name: "value", attr: { kind: "number", default: 0 } }],
  };

  const extractor: CommandArgExtractors = compilePluginCommandExtractor(
    "MockPlugin",
    commandSchema,
    new Map(),
    () => ({
      find: (): JSONValue[] => [],
      pathSegments: (json: JSONValue) => {
        const record = json as Record<string, JSONValue>;
        const value = record["value"];
        if (typeof value === "number") {
          return [{ value, segments: ["value"] }];
        }
        return [];
      },
    }),
  );

  const map = new Map<CommandMapKey, CommandArgExtractors>([
    ["MockPlugin:Add", extractor],
  ]);

  test("正常系: PluginCommandDataから値を抽出できる", () => {
    const command = createCommand("MockPlugin", "Add", { value: "42" });

    const result = extractArgsFromPluginCommandHandled(command, map, handlers);

    expect(result.error).toBeUndefined();
    expect(result.pluginName).toBe("MockPlugin");
    expect(result.commandName).toBe("Add");
    expect(result.args).toEqual([
      {
        rootType: "args",
        rootName: "Add",
        structName: "",
        param: { name: "value", attr: { kind: "number", default: 0 } },
        value: 42,
      },
    ]);
  });

  test("異常系: 未定義コマンドはhandlers.undefinedCommandでerrorを返す", () => {
    const command = createCommand("MockPlugin", "Unknown", { value: "10" });
    const undefinedCommand = vi.fn(handlers.undefinedCommand);
    const deepJSONParseError = vi.fn(handlers.deepJSONParseError);

    const result = extractArgsFromPluginCommandHandled(command, map, {
      undefinedCommand,
      deepJSONParseError,
    });

    expect(undefinedCommand).toHaveBeenCalledTimes(1);
    expect(undefinedCommand).toHaveBeenCalledWith(command);
    expect(deepJSONParseError).not.toHaveBeenCalled();
    expect(result.args).toEqual([]);
    expect(result.error).toEqual({
      message: "undefined command: MockPlugin:Unknown",
      source: "undefinedCommand",
    });
  });

  test("異常系: parse失敗時はhandlers.deepJSONParseErrorでerrorを返す", () => {
    const command = createCommand("MockPlugin", "Add", { value: "x" });
    const parseError = new Error("boom");
    const undefinedCommand = vi.fn(handlers.undefinedCommand);
    const deepJSONParseError = vi.fn(handlers.deepJSONParseError);

    const expectedError: CommandExtractError = {
      message: "parse failed: MockPlugin:Add:Error: boom",
      source: "deepJSONParseError",
    };
    const result = extractArgsFromPluginCommandHandled(
      command,
      map,
      {
        undefinedCommand,
        deepJSONParseError,
      },
      () => {
        throw parseError;
      },
    );

    expect(deepJSONParseError).toHaveBeenCalledTimes(1);
    expect(deepJSONParseError).toHaveBeenCalledWith(command, parseError);
    expect(undefinedCommand).not.toHaveBeenCalled();
    expect(result.args).toEqual([]);
    expect(result.error).toEqual(expectedError);
  });

  test("公開API経由でも未定義キーに対してerrorを返す", () => {
    const command = createCommand("MockPlugin", "Unknown", { value: "1" });

    const expecetdError: CommandExtractError = {
      message: "undefined command: MockPlugin:Unknown",
      source: "undefinedCommand",
    };
    const result = extractArgsFromPluginCommandHandled(
      command,
      map,
      handlers,
      () => ({ value: 1 }),
    );

    expect(result.args).toEqual([]);
    expect(result.error).toEqual(expecetdError);
  });
});
