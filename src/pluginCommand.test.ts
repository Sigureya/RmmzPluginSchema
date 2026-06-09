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
import type { PluginCommandData, PluginSchemaArray } from "./rmmz";
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

describe("pluginCommand", () => {
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
const replacePathList: PluginReplacePathData[] = [
  {
    pluginName: "MockPlugin",
    paramsPath: [],
    commands: [
      {
        commandName: "cmd",
        argsPath: [["note"]],
      },
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
    commands: [
      {
        commandName: "cmd",
        argsPath: [["label"]],
      },
    ],
  },
];

describe("createPluginParamDictionary", () => {
  test("pipeline: dictionary -> command map -> replace -> extract", () => {
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
    const replaceMap = createPluginCommandMap([dictionary]);
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

    expect(replaced.parameters[3]).toEqual({
      value: "42",
      note: MOCK_NEW_TEXT,
    });
    expect(extracted.error).toBeUndefined();
    expect(extracted.args[0]?.value).toBe(42);
    expect(extracted.args[1]?.value).toBe(MOCK_NEW_TEXT);
  });
});
describe("createPluginCommandMap", () => {
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

describe("replaceRuntimePluginCommand", () => {
  test("flow: build map -> replaceRuntimePluginCommand -> extractPluginCommandWithExtractor", () => {
    const replaceMap: PluginCommandPathMap = createPluginCommandMap([
      {
        pluginName: "MockPlugin",
        paramsPath: [],
        commands: [
          {
            commandName: "cmd",
            argsPath: [["note"]],
          },
        ],
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

    const expected: PluginCommandData = {
      code: 357,
      indent: 0,
      parameters: [
        "MockPlugin",
        "cmd",
        "",
        { value: "42", note: MOCK_NEW_TEXT },
      ],
    };
    const fn = vi.fn((value: string) => {
      return value === MOCK_OLD_TEXT ? MOCK_NEW_TEXT : undefined;
    });
    const result: PluginCommandData = replaceRuntimePluginCommand(
      command,
      replaceMap,
      fn,
    );
    expect(result).toEqual(expected);
    expect(fn).toHaveBeenCalledWith("oldTextA");
    expect(fn).not.toHaveBeenCalledWith("42");
  });

  test("returns original command when map key is missing", () => {
    const replaceMap: PluginCommandPathMap = createPluginCommandMap([
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
    const result = replaceRuntimePluginCommand(command, replaceMap, fn);

    expect(result).toBe(command);
    expect(fn).not.toHaveBeenCalled();
  });
});
