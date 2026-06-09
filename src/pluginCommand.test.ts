import { describe, expect, test, vi } from "vitest";
import { JSONPathJS } from "jsonpath-js";
import {
  createPluginParamDictionary,
  replaceRuntimePluginCommand,
} from "./features/replace";
import type {
  PluginCommandPathMap,
  PluginReplacePathData,
} from "./features/replace";
import { createPluginCommandMap } from "./features/replace/build";
import {
  createCommandExtractorMapFromPipeline,
  extractPluginCommandWithExtractor,
} from "./pluginCommand";
import type {
  PluginCommandData,
  PluginSchemaArray,
  PrimitiveParam,
} from "./rmmz";
import { filterPluginSchemaByFn } from "./rmmz";
import type { PluginCommandExtractorSource } from "./types";
import type {
  CommandArgExtractors,
  PluginCommandExtractErrorHandlers,
} from "./index";

const MOCK_OLD_TEXT = "oldTextA";
const MOCK_NEW_TEXT = "newTextA";

const createCommandHandlers = (): PluginCommandExtractErrorHandlers => {
  return {
    commandNotFoundError: () => ({
      message: "not found",
      source: "commandNotFoundError",
    }),
    commandParseError: () => ({
      message: "parse error",
      source: "commandParseError",
    }),
    commandArgsError: () => ({
      message: "args error",
      source: "commandArgsError",
    }),
  };
};

const createExtractor = (): CommandArgExtractors => {
  return {
    pluginName: "MockPlugin",
    commandName: "cmd",
    desc: "",
    text: "",
    extractors: [
      {
        rootCategory: "args",
        rootName: "cmd",
        structs: [],
        structArrays: [],
        top: {
          bundleName: "number",
          arrays: [],
          scalar: {
            jsonPathJS: new JSONPathJS('$["value"]'),
            record: {
              value: {
                kind: "number",
                default: 0,
              },
            },
          },
        },
      },
      {
        rootCategory: "args",
        rootName: "cmd",
        structs: [],
        structArrays: [],
        top: {
          bundleName: "string",
          arrays: [],
          scalar: {
            jsonPathJS: new JSONPathJS('$["note"]'),
            record: {
              note: {
                kind: "string",
                default: "",
              },
            },
          },
        },
      },
    ],
  };
};

const createPipelineResult = (): PluginCommandExtractorSource => {
  return {
    plugins: [
      {
        commandExtractors: [createExtractor()],
      },
    ],
  };
};

describe("extract", () => {
  test("createCommandExtractorMapFromPipeline", () => {
    const map = createCommandExtractorMapFromPipeline(createPipelineResult());
    expect(map.has("MockPlugin:cmd")).toBe(true);
    expect(map.get("MockPlugin:cmd")?.commandName).toBe("cmd");
  });

  test("extractPluginCommandWithExtractor", () => {
    const map = createCommandExtractorMapFromPipeline(createPipelineResult());
    const handlers = createCommandHandlers();
    const command: PluginCommandData = {
      code: 357,
      indent: 0,
      parameters: ["MockPlugin", "cmd", "", { value: "42", note: "ok" }],
    };

    const result = extractPluginCommandWithExtractor(command, map, handlers);

    expect(result.pluginName).toBe("MockPlugin");
    expect(result.commandName).toBe("cmd");
    expect(result.error).toBeUndefined();
    expect(result.args).toHaveLength(2);
    expect(result.args[0]?.value).toBe(42);
    expect(result.args[1]?.value).toBe("ok");
  });

  test("extractPluginCommandWithExtractor: not found", () => {
    const map = new Map();
    const handlers = createCommandHandlers();
    const command: PluginCommandData = {
      code: 357,
      indent: 0,
      parameters: ["MissingPlugin", "missing", "", { value: "1" }],
    };

    const result = extractPluginCommandWithExtractor(command, map, handlers);

    expect(result.args).toEqual([]);
    expect(result.error).toEqual({
      message: "not found",
      source: "commandNotFoundError",
    });
  });

  test("extractPluginCommandWithExtractor: parseFn", () => {
    const map = createCommandExtractorMapFromPipeline(createPipelineResult());
    const handlers = createCommandHandlers();
    const parseFn = vi.fn(() => ({ value: 100, note: "memo" }));
    const command: PluginCommandData = {
      code: 357,
      indent: 0,
      parameters: ["MockPlugin", "cmd", "", { value: "42", note: "ok" }],
    };

    const result = extractPluginCommandWithExtractor(
      command,
      map,
      handlers,
      parseFn,
    );

    expect(parseFn).toHaveBeenCalledWith(command.parameters[3]);
    expect(result.args[0]?.value).toBe(100);
    expect(result.args[1]?.value).toBe("memo");
  });
});

describe("PluiginSchemaArray", () => {
  const schema: PluginSchemaArray = {
    params: [
      { name: "gameTitle", attr: { kind: "string", default: "" } },
      { name: "maxPlayers", attr: { kind: "number", default: 4 } },
      { name: "randomTexts", attr: { kind: "string[]", default: [] } },
      { name: "persons", attr: { kind: "struct[]", struct: "Person" } },
    ],
    structs: [
      {
        struct: "Person",
        params: [
          { name: "name", attr: { kind: "string", default: "" } },
          { name: "age", attr: { kind: "number", default: 0 } },
        ],
      },
      {
        struct: "Vector2",
        params: [
          { name: "x", attr: { kind: "number", default: 0 } },
          { name: "y", attr: { kind: "number", default: 0 } },
        ],
      },
    ],
    commands: [
      {
        command: "cmd",
        args: [
          { name: "value", attr: { kind: "number", default: 0 } },
          { name: "note", attr: { kind: "string", default: "" } },
        ],
      },
      {
        command: "move",
        args: [
          { name: "position", attr: { kind: "struct", struct: "Vector2" } },
        ],
      },
    ],
  };
  test("createPluginParamDictionary", () => {
    const d2: PluginReplacePathData = {
      pluginName: "MockPlugin",
      paramsPath: [
        ["gameTitle"],
        ["maxPlayers"],
        ["randomTexts", "[]"],
        ["persons", "[]", "name"],
        ["persons", "[]", "age"],
      ],
      commands: [
        {
          commandName: "cmd",
          argsPath: [["value"], ["note"]],
        },
        {
          commandName: "move",
          argsPath: [
            ["position", "x"],
            ["position", "y"],
          ],
        },
      ],
    };
    const dictionary2 = createPluginParamDictionary("MockPlugin", schema);
    expect(dictionary2).toEqual(d2);
  });
  describe("filter", () => {
    test("all false", () => {
      const expected: PluginSchemaArray = {
        params: [],
        structs: [],
        commands: [],
      };
      const result = filterPluginSchemaByFn(schema, () => false);
      expect(result).toEqual(expected);
    });
    test("all true", () => {
      const result = filterPluginSchemaByFn(schema, () => true);
      expect(result).toEqual(schema);
    });
    test("number", () => {
      const fn = vi.fn((param: PrimitiveParam) => param.kind === "number");
      const expected: PluginSchemaArray = {
        params: [
          { name: "maxPlayers", attr: { kind: "number", default: 4 } },
          { name: "persons", attr: { kind: "struct[]", struct: "Person" } },
        ],
        structs: [
          {
            struct: "Person",
            params: [{ name: "age", attr: { kind: "number", default: 0 } }],
          },
          {
            struct: "Vector2",
            params: [
              { name: "x", attr: { kind: "number", default: 0 } },
              { name: "y", attr: { kind: "number", default: 0 } },
            ],
          },
        ],
        commands: [
          {
            command: "cmd",
            args: [{ name: "value", attr: { kind: "number", default: 0 } }],
          },
          {
            command: "move",
            args: [
              { name: "position", attr: { kind: "struct", struct: "Vector2" } },
            ],
          },
        ],
      };
      const result = filterPluginSchemaByFn(schema, fn);
      expect(fn).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
    test("string", () => {
      const fn = vi.fn(
        (param: PrimitiveParam) =>
          param.kind === "string" || param.kind === "string[]",
      );
      const expected: PluginSchemaArray = {
        params: [
          { name: "gameTitle", attr: { kind: "string", default: "" } },
          { name: "randomTexts", attr: { kind: "string[]", default: [] } },
          { name: "persons", attr: { kind: "struct[]", struct: "Person" } },
        ],
        structs: [
          {
            struct: "Person",
            params: [{ name: "name", attr: { kind: "string", default: "" } }],
          },
        ],
        commands: [
          {
            command: "cmd",
            args: [{ name: "note", attr: { kind: "string", default: "" } }],
          },
        ],
      };
      const result = filterPluginSchemaByFn(schema, fn);
      expect(fn).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });
});

describe("replace", () => {
  const replacePathList: PluginReplacePathData[] = [
    {
      pluginName: "MockPlugin",
      paramsPath: [],
      commands: [
        { commandName: "cmd", argsPath: [["note"]] },
        {
          commandName: "move",
          argsPath: [
            ["position", "x"],
            ["position", "y"],
          ],
        },
      ],
    },
    {
      pluginName: "OtherPlugin",
      paramsPath: [],
      commands: [{ commandName: "cmd", argsPath: [["label"]] }],
    },
  ];
  const schema: PluginSchemaArray = {
    params: [],
    structs: [],
    commands: [
      {
        command: "cmd",
        args: [
          { name: "value", attr: { kind: "number", default: 0 } },
          { name: "note", attr: { kind: "string", default: "" } },
        ],
      },
    ],
  };
  const dictionary = createPluginParamDictionary("MockPlugin", schema);
  const replaceMap: PluginCommandPathMap = createPluginCommandMap([dictionary]);

  test("引数: schema から command の argsPath を生成できる", () => {
    expect(dictionary).toEqual({
      pluginName: "MockPlugin",
      paramsPath: [],
      commands: [
        {
          commandName: "cmd",
          argsPath: [["value"], ["note"]],
        },
      ],
    });
  });

  test("戻り値: PluginCommandPathMap にキーが構築される", () => {
    expect(replaceMap.get("MockPlugin:cmd")).toEqual({
      argsPath: [["value"], ["note"]],
    });
  });

  test("個別: replaceRuntimePluginCommand で note を置換できる", () => {
    const command: PluginCommandData = {
      code: 357,
      indent: 0,
      parameters: [
        "MockPlugin",
        "cmd",
        "",
        { value: "42", note: MOCK_OLD_TEXT },
      ],
    };
    const fn = vi.fn((value: string) =>
      value === MOCK_OLD_TEXT ? MOCK_NEW_TEXT : undefined,
    );

    const expectedCommand: PluginCommandData = {
      code: 357,
      indent: 0,
      parameters: [
        "MockPlugin",
        "cmd",
        "",
        { value: "42", note: MOCK_NEW_TEXT },
      ],
    };

    const result = replaceRuntimePluginCommand(command, replaceMap, fn);
    expect(result).toEqual(expectedCommand);
    expect(fn).toHaveBeenCalledWith(MOCK_OLD_TEXT);
    expect(fn).not.toHaveBeenCalledWith("42");
  });

  test("個別: replace 後の command を extract できる", () => {
    const extractMap = createCommandExtractorMapFromPipeline(
      createPipelineResult(),
    );
    const handlers = createCommandHandlers();
    const command: PluginCommandData = {
      code: 357,
      indent: 0,
      parameters: [
        "MockPlugin",
        "cmd",
        "",
        { value: "42", note: MOCK_OLD_TEXT },
      ],
    };
    const replaced = replaceRuntimePluginCommand(
      command,
      replaceMap,
      (value) => (value === MOCK_OLD_TEXT ? MOCK_NEW_TEXT : undefined),
    );

    const extracted = extractPluginCommandWithExtractor(
      replaced,
      extractMap,
      handlers,
    );

    expect(extracted.error).toBeUndefined();
    expect(extracted.args[0]?.value).toBe(42);
    expect(extracted.args[1]?.value).toBe(MOCK_NEW_TEXT);
  });

  test("個別: map 不一致時は command をそのまま返す", () => {
    const missingMap: PluginCommandPathMap = createPluginCommandMap([
      {
        pluginName: "OtherPlugin",
        paramsPath: [],
        commands: [{ commandName: "cmd", argsPath: [["note"]] }],
      },
    ]);
    const command: PluginCommandData = {
      code: 357,
      indent: 0,
      parameters: [
        "MockPlugin",
        "cmd",
        "",
        { value: "42", note: MOCK_OLD_TEXT },
      ],
    };
    const fn = vi.fn((value: string) =>
      value === MOCK_OLD_TEXT ? MOCK_NEW_TEXT : undefined,
    );

    const result = replaceRuntimePluginCommand(command, missingMap, fn);

    expect(result).toBe(command);
    expect(fn).not.toHaveBeenCalled();
  });
  test("createPluginCommandMap: builds key and argsPath map", () => {
    type ValueType = { argsPath: string[][] };
    type MapType = ReadonlyMap<string, ValueType>;

    const pathMap: MapType = createPluginCommandMap(replacePathList);

    expect(pathMap.get("MockPlugin:cmd")).toEqual({
      argsPath: [["note"]],
    });
    expect(pathMap.get("MockPlugin:move")).toEqual({
      argsPath: [
        ["position", "x"],
        ["position", "y"],
      ],
    });
    expect(pathMap.get("OtherPlugin:cmd")).toEqual({
      argsPath: [["label"]],
    });
  });
});
