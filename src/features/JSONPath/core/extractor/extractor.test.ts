import { describe, test, expect } from "vitest";
import { JSONPathJS } from "jsonpath-js";
import { extractAllPluginValues } from "./extractor";
import type {
  PluginExtractedValue,
  PluginValuesExtractorBundle,
} from "./types";

describe("extractAllPluginValues", () => {
  test("extracts and flattens values from top, structs and structArrays", () => {
    const bundle: PluginValuesExtractorBundle = {
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
        arrays: [
          {
            jsonPathJS: new JSONPathJS('$["numbers"][*]'),
            schema: {
              name: "numbers",
              attr: { kind: "number[]", default: [] },
            },
            parentType: "",
          },
        ],
      },
      structs: [
        {
          bundleName: "Config",
          scalar: {
            jsonPathJS: new JSONPathJS('$["config"]["name","limit"]'),
            record: {
              name: { kind: "string", default: "" },
              limit: { kind: "number", default: 0 },
            },
          },
          arrays: [
            {
              jsonPathJS: new JSONPathJS('$["config"]["tags"][*]'),
              schema: { name: "tags", attr: { kind: "string[]", default: [] } },
              parentType: "Config",
            },
          ],
        },
      ],
      structArrays: [
        {
          bundleName: "User",
          scalar: {
            jsonPathJS: new JSONPathJS('$["users"][*]["name","score"]'),
            record: {
              name: { kind: "string", default: "" },
              score: { kind: "number", default: 0 },
            },
          },
          arrays: [
            {
              jsonPathJS: new JSONPathJS('$["users"][*]["labels"][*]'),
              schema: {
                name: "labels",
                attr: { kind: "string[]", default: [] },
              },
              parentType: "User",
            },
          ],
        },
      ],
    };

    const value = {
      enabled: true,
      numbers: [10, "skip", 20],
      config: {
        name: "Main",
        limit: 7,
        tags: ["stable", 999, "beta"],
      },
      users: [
        { name: "Alice", score: 50, labels: ["a", 1] },
        { name: "Bob", score: 75, labels: ["b"] },
      ],
    };

    const expected: PluginExtractedValue[] = [
      {
        rootName: "plugin",
        rootType: "param",
        structName: "",
        param: { name: "enabled", attr: { kind: "boolean", default: false } },
        value: true,
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "",
        param: { name: "numbers", attr: { kind: "number[]", default: [] } },
        value: 10,
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "",
        param: { name: "numbers", attr: { kind: "number[]", default: [] } },
        value: 20,
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "Config",
        param: { name: "name", attr: { kind: "string", default: "" } },
        value: "Main",
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "Config",
        param: { name: "limit", attr: { kind: "number", default: 0 } },
        value: 7,
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "Config",
        param: { name: "tags", attr: { kind: "string[]", default: [] } },
        value: "stable",
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "Config",
        param: { name: "tags", attr: { kind: "string[]", default: [] } },
        value: "beta",
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "User",
        param: { name: "name", attr: { kind: "string", default: "" } },
        value: "Alice",
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "User",
        param: { name: "score", attr: { kind: "number", default: 0 } },
        value: 50,
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "User",
        param: { name: "name", attr: { kind: "string", default: "" } },
        value: "Bob",
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "User",
        param: { name: "score", attr: { kind: "number", default: 0 } },
        value: 75,
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "User",
        param: { name: "labels", attr: { kind: "string[]", default: [] } },
        value: "a",
      },
      {
        rootName: "plugin",
        rootType: "param",
        structName: "User",
        param: { name: "labels", attr: { kind: "string[]", default: [] } },
        value: "b",
      },
    ];

    const result = extractAllPluginValues(value, [bundle]);
    expect(result).toEqual(expected);
  });

  test("does not throw when top is undefined", () => {
    const bundle: PluginValuesExtractorBundle = {
      rootName: "plugin",
      rootCategory: "param",
      top: undefined,
      structs: [
        {
          bundleName: "OnlyStruct",
          scalar: {
            jsonPathJS: new JSONPathJS('$["config"]["name"]'),
            record: { name: { kind: "string", default: "" } },
          },
          arrays: [],
        },
      ],
      structArrays: [],
    };
    const expected: PluginExtractedValue[] = [
      {
        rootName: "plugin",
        rootType: "param",
        structName: "OnlyStruct",
        param: { name: "name", attr: { kind: "string", default: "" } },
        value: "ok",
      },
    ];
    const result = extractAllPluginValues({ config: { name: "ok" } }, [bundle]);
    expect(result).toEqual(expected);
  });
});
