import { describe, expect, test, vi } from "vitest";
import type {
  ParsedPlugin,
  PluginParamsRecord,
  ResultOfparsePluginParamRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import { readAllPluginBodies, readPluginInfosSafe } from "./read";
import type { MessageOfparsePluginParamRecordEx } from "./types/msg";

const messages: MessageOfparsePluginParamRecordEx = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully",
};

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

describe("readPluginInfosSafe", () => {
  test("returns parsed plugin info when read and parse succeed", async () => {
    const source = "plugin-list-source";
    const expected: ResultOfparsePluginParamRecord = {
      plugins: [pluginRecord("A")],
      message: messages.success,
      invalidPlugins: 0,
      complete: true,
    };
    const readPluginInfos = vi
      .fn<() => Promise<string>>()
      .mockResolvedValue(source);
    const parsePluginList = vi
      .fn<
        (
          source: string,
          msg: MessageOfparsePluginParamRecordEx,
        ) => ResultOfparsePluginParamRecord
      >()
      .mockReturnValue(expected);

    const result = await readPluginInfosSafe(
      messages,
      readPluginInfos,
      parsePluginList,
    );

    expect(result).toEqual(expected);
    expect(readPluginInfos).toHaveBeenCalledTimes(1);
    expect(parsePluginList).toHaveBeenCalledWith(source, messages);
  });

  test("returns read error result when readPluginInfos throws", async () => {
    const readPluginInfos = vi
      .fn<() => Promise<string>>()
      .mockRejectedValue(new Error("io error"));
    const parsePluginList = vi.fn();

    const expected: ResultOfparsePluginParamRecord = {
      message: messages.readErrorPluginsJS,
      plugins: [],
      invalidPlugins: 0,
      complete: false,
    };
    const result = await readPluginInfosSafe(
      messages,
      readPluginInfos,
      parsePluginList,
    );

    expect(result).toEqual(expected);
    expect(parsePluginList).not.toHaveBeenCalled();
  });

  test("returns read error result when parsePluginList throws", async () => {
    const source = "plugin-list-source";
    const readPluginInfos = vi
      .fn<() => Promise<string>>()
      .mockResolvedValue(source);
    const parsePluginList = vi.fn(() => {
      throw new Error("parse failed");
    });

    const expected: ResultOfparsePluginParamRecord = {
      message: messages.readErrorPluginsJS,
      plugins: [],
      invalidPlugins: 0,
      complete: false,
    };

    const result = await readPluginInfosSafe(
      messages,
      readPluginInfos,
      parsePluginList,
    );

    expect(result).toEqual(expected);
    expect(parsePluginList).toHaveBeenCalledWith(source, messages);
  });
});

describe("readAllPluginBodies", () => {
  test("returns parsed plugin for each record when read and parse succeed", async () => {
    const recordsResult: ResultOfparsePluginParamRecord = {
      plugins: [pluginRecord("PluginA"), pluginRecord("PluginB")],
      message: messages.success,
      invalidPlugins: 0,
      complete: true,
    };
    const readPluginBody = vi
      .fn<(pluginName: string) => Promise<string>>()
      .mockImplementation(async (pluginName: string) => `source:${pluginName}`);
    const parsePluginBody = vi
      .fn<(src: string) => ParsedPlugin>()
      .mockImplementation(() => parsedPlugin());

    const tasks = readAllPluginBodies(
      recordsResult,
      messages,
      readPluginBody,
      parsePluginBody,
    );
    const result = await Promise.all(tasks);
    const expected0 = {
      record: recordsResult.plugins[0],
      plugin: parsedPlugin(),
      error: "",
    };
    const expected1 = {
      record: recordsResult.plugins[1],
      plugin: parsedPlugin(),
      error: "",
    };

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expected0);
    expect(result[1]).toEqual(expected1);
    expect(readPluginBody).toHaveBeenNthCalledWith(1, "PluginA");
    expect(readPluginBody).toHaveBeenNthCalledWith(2, "PluginB");
    expect(parsePluginBody).toHaveBeenCalledTimes(2);
  });

  test("returns read error result when readPluginBody throws", async () => {
    const record = pluginRecord("PluginA");
    const recordsResult: ResultOfparsePluginParamRecord = {
      plugins: [record],
      message: messages.success,
      invalidPlugins: 0,
      complete: true,
    };
    const readPluginBody = vi
      .fn<(pluginName: string) => Promise<string>>()
      .mockRejectedValue(new Error("not found"));
    const parsePluginBody = vi.fn<(src: string) => ParsedPlugin>();

    const [result] = await Promise.all(
      readAllPluginBodies(
        recordsResult,
        messages,
        readPluginBody,
        parsePluginBody,
      ),
    );
    const expected = {
      record,
      plugin: null,
      error: messages.readErrorPluginBody,
    };

    expect(result).toEqual(expected);
    expect(parsePluginBody).not.toHaveBeenCalled();
  });

  test("returns null plugin without error when parsePluginBody throws", async () => {
    const record = pluginRecord("PluginA");
    const recordsResult: ResultOfparsePluginParamRecord = {
      plugins: [record],
      message: messages.success,
      invalidPlugins: 0,
      complete: true,
    };
    const readPluginBody = vi
      .fn<(pluginName: string) => Promise<string>>()
      .mockResolvedValue("body");
    const parsePluginBody = vi.fn(() => {
      throw new Error("parse error");
    });

    const [result] = await Promise.all(
      readAllPluginBodies(
        recordsResult,
        messages,
        readPluginBody,
        parsePluginBody,
      ),
    );
    const expected = {
      record,
      plugin: null,
      error: "",
    };

    expect(result).toEqual(expected);
  });
});
