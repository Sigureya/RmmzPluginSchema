import type { MockedObject } from "vitest";
import { describe, test, expect, vi } from "vitest";
import type {
  JSONValue,
  JSONPathReader,
} from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import { readScalarValue } from "./scalar";
import type { PluginValuesExtractorBundle } from "./types";

const mockedJSONPathReader = (): MockedObject<JSONPathReader> => {
  return {
    find: vi.fn(),
    pathSegments: vi.fn<(value: JSONValue) => []>(() => []),
  };
};

describe("readScalarValue", () => {
  test("returns empty array when no paths found", () => {
    const mockJsonPath = mockedJSONPathReader();
    const bundle: PluginValuesExtractorBundle = {
      rootName: "TestRoot",
      rootCategory: "param",
      top: undefined,
      structs: [],
      structArrays: [],
    };

    const record: Record<string, PluginScalarParam> = {
      testParam: { kind: "number", default: 0 },
    };

    const json: Record<string, JSONValue> = {
      someKey: "someValue",
    };

    const result = readScalarValue(
      bundle,
      "TestStruct",
      json,
      mockJsonPath,
      record
    );
    expect(result).toEqual([]);
    expect(mockJsonPath.pathSegments).toHaveBeenCalledWith(json);
    expect(mockJsonPath.pathSegments).toHaveBeenCalledTimes(1);
    expect(mockJsonPath.find).not.toHaveBeenCalled();
  });
});
