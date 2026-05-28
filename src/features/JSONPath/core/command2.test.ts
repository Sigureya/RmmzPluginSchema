import { describe, expect, test, vi } from "vitest";
import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandData,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { compilePluginCommandExtractor } from "./command";
import { extractArgsFromPluginCommand } from "./command2";
import type {
  CommandArgExtractors,
  CommandExtractError,
  PluginCommandExtractErrorHandlers,
  CommandMapKey,
} from "./extractor/types";

const handlers: PluginCommandExtractErrorHandlers = {
  commandNotFoundError: (context) => ({
    message: `undefined command: ${context.pluginName}:${context.commandName}`,
    source: "commandNotFoundError",
  }),
  commandParseError: (context, error) => ({
    message: `parse failed: ${context.pluginName}:${context.commandName}:${String(error)}`,
    source: "commandParseError",
  }),
  commandArgsError: (context, error) => ({
    message: `extract args failed: ${context.pluginName}:${context.commandName}:${String(error)}`,
    source: "commandArgsError",
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

    const result = extractArgsFromPluginCommand(command, map, handlers);

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
    const commandNotFoundError = vi.fn(handlers.commandNotFoundError);
    const commandParseError = vi.fn(handlers.commandParseError);

    const result = extractArgsFromPluginCommand(command, map, {
      commandNotFoundError,
      commandParseError,
      commandArgsError: () => ({
        message: "custom extract args error",
        source: "commandArgsError",
      }),
    });

    expect(commandNotFoundError).toHaveBeenCalledTimes(1);
    expect(commandNotFoundError).toHaveBeenCalledWith({
      command,
      pluginName: "MockPlugin",
      commandName: "Unknown",
    });
    expect(commandParseError).not.toHaveBeenCalled();
    expect(result.args).toEqual([]);
    expect(result.error).toEqual({
      message: "undefined command: MockPlugin:Unknown",
      source: "commandNotFoundError",
    });
  });

  test("異常系: parse失敗時はhandlers.deepJSONParseErrorでerrorを返す", () => {
    const command = createCommand("MockPlugin", "Add", { value: "x" });
    const parseError = new Error("boom");
    const commandNotFoundError = vi.fn(handlers.commandNotFoundError);
    const commandParseError = vi.fn(handlers.commandParseError);

    const expectedError: CommandExtractError = {
      message: "parse failed: MockPlugin:Add:Error: boom",
      source: "commandParseError",
    };
    const result = extractArgsFromPluginCommand(
      command,
      map,
      {
        commandNotFoundError,
        commandParseError,
        commandArgsError: () => ({
          message: "custom extract args error",
          source: "commandArgsError",
        }),
      },
      () => {
        throw parseError;
      },
    );

    expect(commandParseError).toHaveBeenCalledTimes(1);
    expect(commandParseError).toHaveBeenCalledWith(
      {
        command,
        pluginName: "MockPlugin",
        commandName: "Add",
      },
      parseError,
    );
    expect(commandNotFoundError).not.toHaveBeenCalled();
    expect(result.args).toEqual([]);
    expect(result.error).toEqual(expectedError);
  });

  test("公開API経由でも未定義キーに対してerrorを返す", () => {
    const command = createCommand("MockPlugin", "Unknown", { value: "1" });

    const expecetdError: CommandExtractError = {
      message: "undefined command: MockPlugin:Unknown",
      source: "commandNotFoundError",
    };
    const result = extractArgsFromPluginCommand(command, map, handlers, () => ({
      value: 1,
    }));

    expect(result.args).toEqual([]);
    expect(result.error).toEqual(expecetdError);
  });
});
