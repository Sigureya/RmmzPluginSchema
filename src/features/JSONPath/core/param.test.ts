import type { MockedObject } from "vitest";
import { describe, test, expect, vi } from "vitest";
import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginParamsRecord } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type { PluginValuesExtractorBundle } from "./extractor/types";
import type { PluginParamReadErrorHandlers } from "./param";
import { extractPluginParamFromRecord } from "./param";

const createErrorHandlers = <T>(
  e: T,
): MockedObject<PluginParamReadErrorHandlers<T>> => {
  type H = PluginParamReadErrorHandlers<T>;
  return {
    pluginParamsParseError: vi.fn<H["pluginParamsParseError"]>((): T => {
      return e;
    }),
  };
};

describe("extractPluginParamFromRecord4", () => {
  test("returns extracted params when parse succeeds", () => {
    const record: PluginParamsRecord = {
      name: "TestPlugin",
      status: true,
      description: "for unit test",
      parameters: {
        enabled: "true",
      },
    };

    const extractors: PluginValuesExtractorBundle[] = [
      {
        rootName: "plugin",
        rootCategory: "param",
        top: {
          bundleName: "",
          scalar: {
            jsonPathJS: new JSONPathJS('$["enabled"]'),
            record: {
              enabled: { kind: "boolean", default: false },
            },
          },
          arrays: [],
        },
        structs: [],
        structArrays: [],
      },
    ];

    const parseFn = vi.fn(
      (): Record<string, JSONValue> => ({
        enabled: true,
      }),
    );
    const handlers = createErrorHandlers({
      code: "E_PARSE",
      message: "invalid json",
    });

    const result = extractPluginParamFromRecord(
      record,
      extractors,
      parseFn,
      handlers,
    );

    expect(parseFn).toHaveBeenCalledTimes(1);
    expect(parseFn).toHaveBeenCalledWith(record.parameters);
    expect(handlers.pluginParamsParseError).not.toHaveBeenCalled();
    expect(result).toEqual({
      pluginName: "TestPlugin",
      errorKind: "",
      errorInfo: null,
      params: [
        {
          rootName: "plugin",
          rootType: "param",
          structName: "",
          param: { name: "enabled", attr: { kind: "boolean", default: false } },
          value: true,
        },
      ],
    });
  });

  test("returns parseError result when parse function throws", () => {
    const record: PluginParamsRecord = {
      name: "BrokenPlugin",
      status: false,
      description: "parse fail case",
      parameters: {
        broken: "{",
      },
    };
    const extractors: PluginValuesExtractorBundle[] = [];

    const thrown = new Error("invalid json");
    const parseFn = vi.fn((): Record<string, JSONValue> => {
      throw thrown;
    });
    const parseErrorResult = { code: "E_PARSE", message: "invalid json" };
    const handlers = createErrorHandlers(parseErrorResult);

    const expected: typeof result = {
      pluginName: "BrokenPlugin",
      errorKind: "parseError",
      errorInfo: parseErrorResult,
      params: [],
    };

    const result = extractPluginParamFromRecord(
      record,
      extractors,
      parseFn,
      handlers,
    );

    expect(parseFn).toHaveBeenCalledOnce();
    expect(handlers.pluginParamsParseError).toHaveBeenCalledOnce();
    expect(handlers.pluginParamsParseError).toHaveBeenCalledWith(
      {
        pluginName: "BrokenPlugin",
        record,
      },
      thrown,
    );
    expect(result).toEqual(expected);
  });
});
