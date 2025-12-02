import { describe, expect, test } from "vitest";
import { filterPluginSchemaByVariableParam } from "./arraySchemaFilter";
import type { PluginSchemaArray } from "./types";

describe("filterPluginSchemaByVariableParam", () => {
  test("filters schema to only include variable and variable[] params", () => {
    const schema: PluginSchemaArray = {
      structs: [
        {
          struct: "TestStruct",
          params: [
            {
              name: "varParam",
              attr: { kind: "variable", default: 0 },
            },
            {
              name: "variableArray",
              attr: { kind: "variable[]", default: [] },
            },
          ],
        },
      ],
      commands: [
        {
          command: "Copy",
          args: [
            {
              name: "source",
              attr: { kind: "variable", default: 0 },
            },
            {
              name: "target",
              attr: { kind: "variable", default: 1 },
            },
          ],
        },
      ],
      params: [
        {
          name: "debugView",
          attr: { kind: "variable[]", default: [] },
        },
        {
          name: "testStruct",
          attr: { kind: "struct", struct: "TestStruct" },
        },
        {
          name: "testStructArray",
          attr: { kind: "struct[]", struct: "TestStruct" },
        },
      ],
    };
    const result = filterPluginSchemaByVariableParam(schema);
    expect(result).toEqual(schema);
  });
  test("removes non-variable params from schema", () => {
    const schema: PluginSchemaArray = {
      structs: [],
      commands: [
        {
          command: "ShowMessage",
          args: [
            {
              name: "message",
              attr: { kind: "string", default: "" },
            },
          ],
        },
      ],
      params: [
        {
          name: "username",
          attr: { kind: "string", default: "Player1" },
        },
        {
          name: "level",
          attr: { kind: "number", default: 1 },
        },
        {
          name: "isAdmin",
          attr: { kind: "boolean", default: false },
        },
      ],
    };
    const expected: PluginSchemaArray = {
      structs: [],
      commands: [],
      params: [],
    };
    const result = filterPluginSchemaByVariableParam(schema);
    expect(result).toEqual(expected);
  });
});
