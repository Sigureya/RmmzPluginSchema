import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import { JSONPathJS } from "jsonpath-js";
import type {
  CommandArgExtractors,
  CommandBuildResult,
  CommandExtractError,
  CommandExtractMessageHandlers,
  CommandExtractResult,
  CommandMapKey,
} from "./features";
import { buildCommandExtractorsV2 } from "./features";
import { extractArgsFromPluginCommandHandled } from "./features/JSONPath/core/command2";
import type {
  BuildErrorHandlers,
  JSONPathErrorContext,
} from "./features/JSONPath/core/createPath/types/handlers";
import type { ErrorStruct } from "./features/JSONPath/core/extractor/types/error";
import type { MessageOfparsePluginParamRecordEx } from "./fileio";
import { readAllPluginBodies, readPluginInfosSafe } from "./fileio";
import type { JSONPathReader } from "./libs";
import type {
  PluginSchemaArray,
  PluginTokens,
  DeepJSONParserHandlers,
  ParsedPlugin,
  PluginParamsRecord,
  ResultOfparsePluginParamRecord,
  ClassifiedPluginParams,
  PluginCommandData,
  NumberParam,
  StringParam,
  PluginParamEx,
} from "./rmmz";
import { classifyPluginParams, compilePluginAsArraySchema } from "./rmmz";

// 意図的に単一ファイルにまとめている。
// これらの処理はパイプラインの最初から最後までを担う

const mockStructDefault = {
  mockText: "mock text",
  mockNum: 0,
  mockBool: false,
};

const pluginsRecord: PluginParamsRecord[] = [];
const msg1: MessageOfparsePluginParamRecordEx = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully",
};

const paresdPlugin: ParsedPlugin = {
  locale: "ja",
  meta: {},
  params: [
    { name: "textParam", attr: { kind: "string", default: "" } },
    { name: "numParam", attr: { kind: "number", default: "0" } },
    { name: "boolParam", attr: { kind: "boolean", default: "false" } },
  ],
  commands: [
    {
      command: "cmd",
      desc: "test desc",
      text: "mock text",
      args: [
        {
          name: "value",
          attr: { kind: "number", default: "0" },
        },
        {
          name: "note",
          attr: { kind: "string", default: "" },
        },
      ],
    },
  ],
  structs: [
    {
      name: "Person",
      params: [
        { name: "name", attr: { kind: "string", default: "Alice" } },
        { name: "age", attr: { kind: "number", default: "17" } },
      ],
    },
  ],
  helpLines: ["abc", "xyz"],
  dependencies: {
    base: [],
    orderAfter: [],
    orderBefore: [],
  },
};

const valueArg: PluginParamEx<NumberParam> = {
  name: "value",
  attr: {
    kind: "number",
    default: 0,
  },
};

const noteArg: PluginParamEx<StringParam> = {
  name: "note",
  attr: {
    kind: "string",
    default: "",
  },
};

const schema: PluginSchemaArray = {
  commands: [
    {
      command: "cmd",
      desc: "test desc",
      text: "mock text",
      args: [valueArg, noteArg],
    },
  ],
  params: [
    { attr: { default: "", kind: "string" }, name: "textParam" },
    { attr: { default: 0, kind: "number" }, name: "numParam" },
    { attr: { default: false, kind: "boolean" }, name: "boolParam" },
  ],
  structs: [
    {
      struct: "Person",
      params: [
        { attr: { default: "Alice", kind: "string" }, name: "name" },
        { attr: { default: 17, kind: "number" }, name: "age" },
      ],
    },
  ],
};
const classify: ClassifiedPluginParams = {
  scalars: [
    { attr: { default: "", kind: "string" }, name: "textParam" },
    { attr: { default: 0, kind: "number" }, name: "numParam" },
    { attr: { default: false, kind: "boolean" }, name: "boolParam" },
  ],
  scalarArrays: [],
  structArrays: [],
  structs: [],
};

const createDeepJSONParseMock = (): MockedObject<DeepJSONParserHandlers> => {
  return {
    parseObject: vi.fn<DeepJSONParserHandlers["parseObject"]>(() => {
      return {
        errors: [],
        value: mockStructDefault,
      };
    }),
    parseObjectArray: vi.fn<DeepJSONParserHandlers["parseObjectArray"]>(() => {
      return {
        errors: [],
        value: [mockStructDefault],
      };
    }),
    parseStringArray: vi.fn<DeepJSONParserHandlers["parseStringArray"]>(() => {
      return {
        errors: [],
        value: ["mock string"],
      };
    }),
  };
};

const createCommandExtractMessageHandlers = (
  commandError: CommandExtractError,
): MockedObject<CommandExtractMessageHandlers> => {
  return {
    undefinedCommand: vi.fn<CommandExtractMessageHandlers["undefinedCommand"]>(
      () => commandError,
    ),
    deepJSONParseError: vi.fn<
      CommandExtractMessageHandlers["deepJSONParseError"]
    >(() => commandError),
    extractArgsError: vi.fn<CommandExtractMessageHandlers["extractArgsError"]>(
      () => commandError,
    ),
  };
};
type JSONPathErrorHandles = BuildErrorHandlers<ErrorStruct>;

const mockCompileJSONPathSchemaError: ErrorStruct = {
  argName: "",
  commandName: "",
  message: "compile error",
  pluginName: "",
  code: "compile_jsonpath_schema_error",
  source: "compileJSONPathSchema",
};

const mockStructPathError: ErrorStruct = {
  argName: "",
  commandName: "",
  message: "struct path error",
  pluginName: "",
  source: "createPath",
  code: "struct_path_error",
};

const createJSONPathErrorHandlers = (): MockedObject<JSONPathErrorHandles> => {
  return {
    compileJSONPathSchemaError: vi.fn<
      JSONPathErrorHandles["compileJSONPathSchemaError"]
    >(() => mockCompileJSONPathSchemaError),
    structPathError: vi.fn<JSONPathErrorHandles["structPathError"]>(
      () => mockStructPathError,
    ),
  };
};

const createStructMap = (): ReadonlyMap<string, ClassifiedPluginParams> =>
  new Map<string, ClassifiedPluginParams>([
    [
      "Person",
      {
        structs: [],
        structArrays: [],
        scalarArrays: [],
        scalars: [
          { name: "name", attr: { kind: "string", default: "Alice" } },
          { name: "age", attr: { kind: "number", default: 17 } },
        ],
      },
    ],
  ]);

describe("File IO", () => {
  const mockSrc = "mock plugin list source";
  const context: ResultOfparsePluginParamRecord = {
    plugins: pluginsRecord,
    complete: true,
    invalidPlugins: 0,
    message: msg1.success,
  };
  describe("readPluginInfosSafe", () => {
    test("normal", async () => {
      const readPluginInfos = vi
        .fn<() => Promise<string>>()
        .mockResolvedValue(mockSrc);

      const parseFn = vi.fn<
        (
          source: string,
          msg: MessageOfparsePluginParamRecordEx,
        ) => ResultOfparsePluginParamRecord
      >((a, b): ResultOfparsePluginParamRecord => {
        return {
          plugins: pluginsRecord,
          complete: true,
          invalidPlugins: 0,
          message: b.success,
        };
      });
      const result = await readPluginInfosSafe(msg1, readPluginInfos, parseFn);
      expect(readPluginInfos).toHaveBeenCalledWith();
      expect(readPluginInfos).toHaveBeenCalledOnce();
      expect(parseFn).toHaveBeenCalledOnce();
      expect(parseFn).toHaveBeenCalledWith(mockSrc, msg1);
      expect(result).toEqual(context);
    });
  });
  describe("readAllPluginBodies", () => {
    const mockBodySrc = "mock plugin body source";
    test("normal", async () => {
      const readPluginFn = vi
        .fn<(pluginName: string) => Promise<string>>()
        .mockResolvedValue(mockBodySrc);
      const parsePluginBodyFn = vi.fn<(src: string) => ParsedPlugin>(() => {
        return paresdPlugin;
      });
      const result = readAllPluginBodies(
        context,
        msg1,
        readPluginFn,
        parsePluginBodyFn,
      );
      expect(result.length).toBe(pluginsRecord.length);
      expect(readPluginFn).toHaveBeenCalledTimes(pluginsRecord.length);
      expect(parsePluginBodyFn).toHaveBeenCalledTimes(pluginsRecord.length);
      context.plugins.forEach((plugin: PluginParamsRecord, index) => {
        expect(readPluginFn).toHaveBeenCalledWith(plugin.name);
        expect(parsePluginBodyFn).toHaveBeenNthCalledWith(
          index + 1,
          mockBodySrc,
        );
      });
    });
  });
});

describe("rmmz", () => {
  describe("compilePluginAsArraySchema", () => {
    test("normal", () => {
      const deepJSONParseMock = createDeepJSONParseMock();
      const result: PluginSchemaArray = compilePluginAsArraySchema(
        paresdPlugin,
        deepJSONParseMock,
      );

      expect(result).toEqual(schema);
      expect(deepJSONParseMock.parseObject).not.toHaveBeenCalled();
      expect(deepJSONParseMock.parseObjectArray).not.toHaveBeenCalled();
      expect(deepJSONParseMock.parseStringArray).not.toHaveBeenCalled();
    });
    describe("struct", () => {
      const tokens: PluginTokens = {
        commands: [
          {
            command: "add",
            args: [
              {
                name: "personArg",
                attr: { kind: "struct", struct: "Person" },
              },
            ],
          },
        ],
        params: [
          { name: "personParam", attr: { kind: "struct", struct: "Person" } },
        ],
        structs: [
          {
            name: "Person",
            params: [
              { name: "name", attr: { kind: "string", default: "Alice" } },
              { name: "age", attr: { kind: "number", default: "19" } },
            ],
          },
        ],
      };
      test("result", () => {
        const deepJSONParseMock = createDeepJSONParseMock();
        const expected: PluginSchemaArray = {
          commands: [
            {
              command: "add",
              args: [
                {
                  name: "personArg",
                  attr: {
                    kind: "struct",
                    struct: "Person",
                    default: mockStructDefault,
                  },
                },
              ],
            },
          ],
          params: [
            {
              name: "personParam",
              attr: {
                default: mockStructDefault,
                kind: "struct",
                struct: "Person",
              },
            },
          ],
          structs: [
            {
              struct: "Person",
              params: [
                { attr: { default: "Alice", kind: "string" }, name: "name" },
                { attr: { default: 19, kind: "number" }, name: "age" },
              ],
            },
          ],
        };
        const result = compilePluginAsArraySchema(tokens, deepJSONParseMock);
        expect(result).toEqual(expected);
      });
    });
  });
  describe("classifyPluginParams", () => {
    test("normal", () => {
      const result: ClassifiedPluginParams = classifyPluginParams(
        schema.params,
      );
      expect(result).toEqual(classify);
    });
  });
});
const commandMap: ReadonlyMap<CommandMapKey, CommandArgExtractors> = new Map<
  CommandMapKey,
  CommandArgExtractors
>([
  [
    "MockPlugin:cmd",
    {
      commandName: "cmd",
      desc: "test desc",
      pluginName: "MockPlugin",
      text: "mock text",
      extractors: [
        {
          structs: [],
          structArrays: [],
          top: {
            arrays: [],
            bundleName: "",
            scalar: {
              record: {
                value: valueArg.attr,
                note: noteArg.attr,
              },
              jsonPathJS: new JSONPathJS(`$["value","note"]`),
            },
          },
          rootName: "cmd",
          rootCategory: "args",
        },
      ],
    },
  ],
]);

const pluginCommand: PluginCommandData = {
  code: 357,
  parameters: ["MockPlugin", "cmd", "test desc", { value: "42", note: "ok" }],
};

const cmdExtractor: CommandArgExtractors = {
  commandName: "cmd",
  desc: "test desc",
  pluginName: "MockPlugin",
  text: "mock text",
  extractors: [
    {
      rootCategory: "args",
      rootName: "cmd",
      structArrays: [],
      structs: [],
      top: {
        bundleName: "number",
        arrays: [],
        scalar: {
          jsonPathJS: new JSONPathJS(`$["value"]`),
          record: {
            value: valueArg.attr,
          },
        },
      },
    },
    {
      rootName: "cmd",
      rootCategory: "args",
      structArrays: [],
      structs: [],
      top: {
        arrays: [],
        bundleName: "string",
        scalar: {
          jsonPathJS: new JSONPathJS(`$["note"]`),
          record: {
            note: noteArg.attr,
          },
        },
      },
    },
  ],
};

describe("JSON Path", () => {
  describe("extractArgsFromPluginCommandHandled", () => {
    test("Mapに登録されてない場合", () => {
      const expected: Required<CommandExtractResult> = {
        args: [],
        commandName: "cmd",
        pluginName: "MockPlugin",
        error: {
          message: "error msg",
          source: "source eee",
        },
      };
      const parseFn = vi.fn();
      const handlers = createCommandExtractMessageHandlers(expected.error);

      const result: CommandExtractResult = extractArgsFromPluginCommandHandled(
        pluginCommand,
        new Map(),
        handlers,
        parseFn,
      );
      expect(handlers.undefinedCommand).toHaveBeenCalledWith(pluginCommand);
      expect(handlers.deepJSONParseError).not.toHaveBeenCalled();
      expect(handlers.extractArgsError).not.toHaveBeenCalled();
      expect(parseFn).not.toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
    test("Mapに登録されてる場合", () => {
      const value = { value: 42, note: "ok" };
      const handlers = createCommandExtractMessageHandlers({
        message: "normal",
        source: "normal",
      });
      const parseFn = vi.fn(() => value);

      const expected: CommandExtractResult = {
        pluginName: "MockPlugin",
        commandName: "cmd",
        args: [
          {
            rootType: "args",
            rootName: "cmd",
            structName: "",
            param: valueArg,
            value: 42,
          },
          {
            rootType: "args",
            rootName: "cmd",
            structName: "",
            param: noteArg,
            value: "ok",
          },
        ],
      };
      const result: CommandExtractResult = extractArgsFromPluginCommandHandled(
        pluginCommand,
        commandMap,
        handlers,
        parseFn,
      );
      expect(parseFn).toHaveBeenCalledWith(pluginCommand.parameters[3]);
      expect(handlers.undefinedCommand).not.toHaveBeenCalled();
      expect(handlers.deepJSONParseError).not.toHaveBeenCalled();
      expect(handlers.extractArgsError).not.toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
    test("JSONのパースに失敗する場合", () => {
      const parseError = new Error("parse error");
      const errorMessage: CommandExtractError = {
        message: "xxx",
        source: "deepJSONParseError",
      };
      const handlers = createCommandExtractMessageHandlers(errorMessage);
      const parseFn = vi.fn(() => {
        throw parseError;
      });
      const expected: CommandExtractResult = {
        pluginName: "MockPlugin",
        commandName: "cmd",
        args: [],
        error: errorMessage,
      };
      const result: CommandExtractResult = extractArgsFromPluginCommandHandled(
        pluginCommand,
        commandMap,
        handlers,
        parseFn,
      );
      expect(parseFn).toHaveBeenCalledWith(pluginCommand.parameters[3]);
      expect(handlers.undefinedCommand).not.toHaveBeenCalled();
      expect(handlers.extractArgsError).not.toHaveBeenCalled();
      expect(handlers.deepJSONParseError).toHaveBeenCalledOnce();
      expect(handlers.deepJSONParseError).toHaveBeenCalledWith(
        pluginCommand,
        parseError,
      );
      expect(result).toEqual(expected);
    });
  });
});
