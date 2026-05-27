import { describe, expect, test } from "vitest";
import type { PluginReadResult } from "@RmmzPluginSchema/fileio/types";
import type {
  ParsedPlugin,
  PluginCommandData,
  PluginParam,
  PluginParamsRecord,
  PluginParamTokens,
} from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type { ConvertPluginResult, PluginExtractedValue } from "./core";
import { extractArgsFromPluiginCommand, mergeCommandMap } from "./plugin";
import {
  jsonPathFromPluginReadResult,
  jsonPathFromPluginReadResults,
} from "./top";

const createRecord = (
  name: string,
  count: string,
  title: string,
): PluginParamsRecord => {
  return {
    name,
    status: true,
    description: "top test",
    parameters: {
      count,
      title,
    },
  };
};

const createParams = (): PluginParamTokens[] => {
  return [
    { name: "count", attr: { kind: "number", default: "0" } },
    { name: "title", attr: { kind: "string", default: "" } },
  ];
};

const createParsedPlugin = (): ParsedPlugin => {
  return {
    locale: "ja",
    meta: {},
    params: createParams(),
    commands: [
      {
        command: "Add",
        args: [{ name: "value", attr: { kind: "number", default: "0" } }],
      },
    ],
    structs: [],
    helpLines: [],
    dependencies: {
      base: [],
      orderAfter: [],
      orderBefore: [],
    },
  };
};

const createReadResult = (
  pluginName: string,
  count: string,
  title: string,
): PluginReadResult => {
  return {
    plugin: createParsedPlugin(),
    error: "",
    record: createRecord(pluginName, count, title),
  };
};

describe("jsonPathFromPluginReadResult", () => {
  test("PluginReadResult を ConvertPluginResult へ変換できる", () => {
    const readResult = createReadResult("PluginA", "10", "Hero");

    const result = jsonPathFromPluginReadResult(readResult, (path) => {
      return new JSONPathJS(path);
    });

    expect(result).not.toBeNull();
    expect(result?.schema.pluginName).toBe("PluginA");
    expect(result?.record.name).toBe("PluginA");
    expect(result?.extractorEntries).toHaveLength(1);
    expect(result?.params).toEqual([
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
  });

  test("plugin が null の場合は null を返す", () => {
    const readResult: PluginReadResult = {
      plugin: null,
      error: "read failed",
      record: createRecord("PluginB", "0", ""),
    };

    const result = jsonPathFromPluginReadResult(readResult, (path) => {
      return new JSONPathJS(path);
    });

    expect(result).toBeNull();
  });
});

describe("jsonPathFromPluginReadResults", () => {
  test("複数結果を変換し null plugin を除外する", () => {
    const readResults: PluginReadResult[] = [
      createReadResult("PluginA", "10", "Hero"),
      {
        plugin: null,
        error: "parse failed",
        record: createRecord("PluginB", "20", "Mage"),
      },
      createReadResult("PluginC", "30", "Knight"),
    ];

    const expectedParams0: PluginExtractedValue<PluginParam>[] = [
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
    ];
    const expectedParams1: PluginExtractedValue<PluginParam>[] = [
      {
        rootType: "param",
        rootName: "count",
        structName: "",
        param: { name: "count", attr: { kind: "number", default: 0 } },
        value: 30,
      },
      {
        rootType: "param",
        rootName: "title",
        structName: "",
        param: { name: "title", attr: { kind: "string", default: "" } },
        value: "Knight",
      },
    ];

    const result: ConvertPluginResult[] = jsonPathFromPluginReadResults(
      readResults,
      (path) => {
        return new JSONPathJS(path);
      },
    );

    expect(result).toHaveLength(2);
    expect(result[0].schema.pluginName).toBe("PluginA");
    expect(result[1].schema.pluginName).toBe("PluginC");
    expect(result[0].params).toEqual(expectedParams0);
    expect(result[1].params).toEqual(expectedParams1);
  });
});

describe("command extraction integration", () => {
  test("JSONPath変換結果からコマンド抽出APIが新契約で動作する", () => {
    const readResult = createReadResult("PluginA", "10", "Hero");

    const convertResult = jsonPathFromPluginReadResult(readResult, (path) => {
      return new JSONPathJS(path);
    });

    expect(convertResult).not.toBeNull();
    const commandMap = mergeCommandMap([convertResult!]);

    // 正常系: 定義済みコマンドを抽出
    const command: PluginCommandData = {
      code: 357,
      parameters: ["PluginA", "Add", "Add", { value: "42" }],
    };

    const extracted = extractArgsFromPluiginCommand(command, commandMap);
    expect(extracted.error).toBeUndefined();
    expect(extracted.args).toHaveLength(1);
    expect(extracted.args[0].value).toBe(42);

    // 異常系: 未定義コマンドはerror付き結果を返す
    const undefinedCommand: PluginCommandData = {
      code: 357,
      parameters: ["PluginA", "Unknown", "Unknown", {}],
    };

    const undefinedExtracted = extractArgsFromPluiginCommand(
      undefinedCommand,
      commandMap,
    );
    expect(undefinedExtracted.error).toBeDefined();
    expect(undefinedExtracted.error?.source).toBe("undefinedCommand");
    expect(undefinedExtracted.args).toEqual([]);
  });
});
