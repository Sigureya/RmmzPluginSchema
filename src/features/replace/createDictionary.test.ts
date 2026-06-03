import { describe, expect, test } from "vitest";
import type { PluginSchemaArray } from "@RmmzPluginSchema/rmmz/plugin";
import { createDictionary } from "./createDictionary";
import type { TargetPath } from "./handlers";

describe("createDictionary", () => {
  test("collects primitive param paths", () => {
    const schema: PluginSchemaArray = {
      commands: [],
      structs: [],
      params: [
        { name: "title", attr: { kind: "string", default: "" } },
        { name: "actorId", attr: { kind: "number", default: 0 } },
      ],
    };
    const expected: TargetPath = {
      pluginName: "PluginA",
      paramsPath: [["title"], ["actorId"]],
      commands: [],
    };
    expect(createDictionary("PluginA", schema)).toEqual(expected);
  });

  test("collects array param paths", () => {
    const schema: PluginSchemaArray = {
      commands: [],
      structs: [],
      params: [{ name: "names", attr: { kind: "string[]", default: [] } }],
    };
    const expected: TargetPath = {
      pluginName: "PluginA",
      paramsPath: [["names", "[]"]],
      commands: [],
    };

    expect(createDictionary("PluginA", schema)).toEqual(expected);
  });

  test("collects struct paths", () => {
    const schema: PluginSchemaArray = {
      commands: [],
      params: [
        {
          name: "enemy",
          attr: { kind: "struct", struct: "Enemy", default: {} },
        },
      ],
      structs: [
        {
          struct: "Enemy",
          params: [
            { name: "name", attr: { kind: "string", default: "" } },
            { name: "hp", attr: { kind: "number", default: 0 } },
          ],
        },
      ],
    };

    const expected: TargetPath = {
      pluginName: "PluginA",
      paramsPath: [
        ["enemy", "name"],
        ["enemy", "hp"],
      ],
      commands: [],
    };

    expect(createDictionary("PluginA", schema)).toEqual(expected);
  });

  test("collects struct array paths", () => {
    const schema: PluginSchemaArray = {
      commands: [],
      params: [
        {
          name: "nameTables",
          attr: {
            kind: "struct[]",
            struct: "NameTable",
            default: [],
          },
        },
      ],
      structs: [
        {
          struct: "NameTable",
          params: [
            {
              name: "variableId",
              attr: {
                kind: "number",
                default: 0,
              },
            },
            {
              name: "names",
              attr: {
                kind: "string[]",
                default: [],
              },
            },
          ],
        },
      ],
    };

    const expected: TargetPath = {
      pluginName: "PluginA",
      paramsPath: [
        ["nameTables", "[]", "variableId"],
        ["nameTables", "[]", "names", "[]"],
      ],
      commands: [],
    };

    expect(createDictionary("PluginA", schema)).toEqual(expected);
  });

  test("collects command argument paths", () => {
    const schema: PluginSchemaArray = {
      params: [],
      structs: [
        {
          struct: "NameTable",
          params: [
            { name: "variableId", attr: { kind: "number", default: 0 } },
            { name: "names", attr: { kind: "string[]", default: [] } },
          ],
        },
      ],
      commands: [
        {
          command: "changeName",
          args: [
            { name: "actorId", attr: { kind: "number", default: 0 } },
            {
              name: "nameTable",
              attr: { kind: "struct[]", struct: "NameTable", default: [] },
            },
          ],
        },
      ],
    };

    const expected: TargetPath = {
      pluginName: "PluginA",
      paramsPath: [],
      commands: [
        {
          commandName: "changeName",
          argsPath: [
            ["actorId"],
            ["nameTable", "[]", "variableId"],
            ["nameTable", "[]", "names", "[]"],
          ],
        },
      ],
    };

    expect(createDictionary("PluginA", schema)).toEqual(expected);
  });

  test("stops recursive struct expansion", () => {
    const schema: PluginSchemaArray = {
      commands: [],
      params: [
        { name: "root", attr: { kind: "struct", struct: "Node", default: {} } },
      ],
      structs: [
        {
          struct: "Node",
          params: [
            { name: "name", attr: { kind: "string", default: "" } },
            {
              name: "child",
              attr: { kind: "struct", struct: "Node", default: {} },
            },
          ],
        },
      ],
    };

    const expected: TargetPath = {
      pluginName: "PluginA",
      paramsPath: [
        ["root", "name"],
        ["root", "child"],
      ],
      commands: [],
    };

    expect(createDictionary("PluginA", schema)).toEqual(expected);
  });
});
