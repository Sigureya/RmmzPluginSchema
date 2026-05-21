import { describe, expect, test, vi } from "vitest";
import type {
  ParsedPlugin,
  PluginParamsRecord,
  ResultOfparsePluginParamRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import { createDeepJSONParserHandlers } from "../rmmz/plugin/core/deepJSONHandler";
import { READ_PLUGIN_MESSAGES, readPluginsWithSchema } from "./convert";
import type { PluginReadHandlers } from "./types/handlers";

const pluginRecord = (name: string): PluginParamsRecord => {
  return {
    name,
    status: true,
    description: "desc",
    parameters: {},
  };
};

const parsedPlugin = (): ParsedPlugin => {
  return {
    locale: "ja",
    meta: {},
    params: [],
    commands: [],
    structs: [],
    helpLines: [],
    dependencies: {
      base: [],
      orderAfter: [],
      orderBefore: [],
    },
  };
};

const createRecordsResult = (
  plugins: PluginParamsRecord[],
): ResultOfparsePluginParamRecord => {
  return {
    plugins,
    message: READ_PLUGIN_MESSAGES.success,
    invalidPlugins: 0,
    complete: true,
  };
};

describe("readPluginsWithSchema", () => {
  test("returns converted plugin schema entries when all reads succeed", async () => {
    const recordsResult = createRecordsResult([pluginRecord("PluginA")]);
    const readPluginInfos = vi
      .fn<() => Promise<string>>()
      .mockResolvedValue("list");
    const parsePluginList = vi
      .fn<
        (
          source: string,
          msg: typeof READ_PLUGIN_MESSAGES,
        ) => ResultOfparsePluginParamRecord
      >()
      .mockReturnValue(recordsResult);
    const readPluginBody = vi
      .fn<(pluginName: string) => Promise<string>>()
      .mockResolvedValue("body");
    const parsePluginBody = vi
      .fn<(src: string) => ParsedPlugin>()
      .mockReturnValue(parsedPlugin());
    const jsonPath = vi.fn((path: string) => new JSONPathJS(path));
    const handlers: PluginReadHandlers = {
      readPluginInfos,
      parsePluginList,
      readPluginBody,
      parsePluginBody,
      jsonPath,
    };

    const result = await readPluginsWithSchema(
      READ_PLUGIN_MESSAGES,
      handlers,
      createDeepJSONParserHandlers(),
    );
    const expected = [
      {
        record: recordsResult.plugins[0],
        schema: {
          pluginName: "PluginA",
          schema: {
            params: [],
            commands: [],
            structs: [],
          },
        },
        extractorEntries: [],
        params: [],
      },
    ];

    expect(result).toEqual(expected);
    expect(readPluginInfos).toHaveBeenCalledTimes(1);
    expect(parsePluginList).toHaveBeenCalledWith("list", READ_PLUGIN_MESSAGES);
    expect(readPluginBody).toHaveBeenCalledWith("PluginA");
    expect(parsePluginBody).toHaveBeenCalledWith("body");
    expect(jsonPath).not.toHaveBeenCalled();
  });

  test("skips plugins when body read fails", async () => {
    const recordsResult = createRecordsResult([
      pluginRecord("PluginA"),
      pluginRecord("PluginB"),
    ]);
    const handlers: PluginReadHandlers = {
      readPluginInfos: vi.fn<() => Promise<string>>().mockResolvedValue("list"),
      parsePluginList: vi.fn().mockReturnValue(recordsResult),
      readPluginBody: vi
        .fn<(pluginName: string) => Promise<string>>()
        .mockImplementation(async (pluginName: string) => {
          if (pluginName === "PluginB") {
            throw new Error("missing");
          }
          return "body";
        }),
      parsePluginBody: vi
        .fn<(src: string) => ParsedPlugin>()
        .mockReturnValue(parsedPlugin()),
      jsonPath: vi.fn((path: string) => new JSONPathJS(path)),
    };

    const result = await readPluginsWithSchema(
      READ_PLUGIN_MESSAGES,
      handlers,
      createDeepJSONParserHandlers(),
    );
    const expected = [
      {
        record: recordsResult.plugins[0],
        schema: {
          pluginName: "PluginA",
          schema: {
            params: [],
            commands: [],
            structs: [],
          },
        },
        extractorEntries: [],
        params: [],
      },
    ];

    expect(result).toEqual(expected);
  });

  test("returns empty list when readPluginInfos fails", async () => {
    const parsePluginList = vi.fn();
    const handlers: PluginReadHandlers = {
      readPluginInfos: vi
        .fn<() => Promise<string>>()
        .mockRejectedValue(new Error("io")),
      parsePluginList,
      readPluginBody: vi.fn<(pluginName: string) => Promise<string>>(),
      parsePluginBody: vi.fn<(src: string) => ParsedPlugin>(),
      jsonPath: vi.fn((path: string) => new JSONPathJS(path)),
    };

    const result = await readPluginsWithSchema(
      READ_PLUGIN_MESSAGES,
      handlers,
      createDeepJSONParserHandlers(),
    );
    const expected: [] = [];

    expect(result).toEqual(expected);
    expect(parsePluginList).not.toHaveBeenCalled();
  });

  test("returns empty list when parsePluginList fails", async () => {
    const handlers: PluginReadHandlers = {
      readPluginInfos: vi.fn<() => Promise<string>>().mockResolvedValue("list"),
      parsePluginList: vi.fn(() => {
        throw new Error("parse failed");
      }),
      readPluginBody: vi.fn<(pluginName: string) => Promise<string>>(),
      parsePluginBody: vi.fn<(src: string) => ParsedPlugin>(),
      jsonPath: vi.fn((path: string) => new JSONPathJS(path)),
    };

    const result = await readPluginsWithSchema(
      READ_PLUGIN_MESSAGES,
      handlers,
      createDeepJSONParserHandlers(),
    );
    const expected: [] = [];

    expect(result).toEqual(expected);
    expect(handlers.readPluginBody).not.toHaveBeenCalled();
  });
});
