import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { MessageOfparsePluginParamRecordEx } from "./fileio";
import { readAllPluginBodies, readPluginInfosSafe } from "./fileio";
import type {
  PluginSchemaArray,
  PluginTokens,
  DeepJSONParserHandlers,
  ParsedPlugin,
  PluginParamsRecord,
  ResultOfparsePluginParamRecord,
  ClassifiedPluginParams,
} from "./rmmz";
import { classifyPluginParams, compilePluginAsArraySchema } from "./rmmz";

const mockStructDefault = {
  mockText: "mock text",
  mockNum: 0,
  mockBool: false,
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
    { command: "cmd", args: [], desc: "test desc", text: "mock text" },
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

const schema: PluginSchemaArray = {
  commands: [
    { args: [], command: "cmd", desc: "test desc", text: "mock text" },
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
