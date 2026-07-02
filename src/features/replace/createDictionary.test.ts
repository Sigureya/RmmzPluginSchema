import { describe, expect, test } from "vitest";
import type { PluginSchemaArray } from "@RmmzPluginSchema/rmmz/plugin";
import {
  createPluginCommandMap,
  createPluginParamDictionary,
} from "./createDictionary";
import type { PluginReplacePathData } from "./types";

describe("createPluginCommandMap", () => {
  test("sample", () => {
    const pluginList: ReadonlyArray<PluginReplacePathData> = [
      {
        pluginName: "PluginA",
        paramsPath: [["param1"], ["param2", "[]"]],
        commands: [
          {
            commandName: "command1",
            argsPath: [["arg1"], ["arg2", "[]"]],
          },
        ],
      },
      {
        pluginName: "PluginB",
        commands: [
          {
            commandName: "command2",
            argsPath: [["message"]],
          },
        ],
        paramsPath: [],
      },
      {
        pluginName: "EmptyPlugin",
        paramsPath: [["param3"]],
        commands: [],
      },
    ];
    const expected = new Map([
      [
        "PluginA:command1",
        {
          argsPath: [["arg1"], ["arg2", "[]"]],
        },
      ],
      ["PluginB:command2", { argsPath: [["message"]] }],
    ]);
    const result = createPluginCommandMap(pluginList);
    expect(result).toEqual(expected);
  });
});

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
    const expected: PluginReplacePathData = {
      pluginName: "PluginA",
      paramsPath: [["title"], ["actorId"]],
      commands: [],
    };
    expect(createPluginParamDictionary("PluginA", schema)).toEqual(expected);
  });

  test("collects array param paths", () => {
    const schema: PluginSchemaArray = {
      commands: [],
      structs: [],
      params: [{ name: "names", attr: { kind: "string[]", default: [] } }],
    };
    const expected: PluginReplacePathData = {
      pluginName: "PluginA",
      paramsPath: [["names", "[]"]],
      commands: [],
    };

    expect(createPluginParamDictionary("PluginA", schema)).toEqual(expected);
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

    const expected: PluginReplacePathData = {
      pluginName: "PluginA",
      paramsPath: [
        ["enemy", "name"],
        ["enemy", "hp"],
      ],
      commands: [],
    };

    expect(createPluginParamDictionary("PluginA", schema)).toEqual(expected);
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

    const expected: PluginReplacePathData = {
      pluginName: "PluginA",
      paramsPath: [
        ["nameTables", "[]", "variableId"],
        ["nameTables", "[]", "names", "[]"],
      ],
      commands: [],
    };

    expect(createPluginParamDictionary("PluginA", schema)).toEqual(expected);
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

    const expected: PluginReplacePathData = {
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

    expect(createPluginParamDictionary("PluginA", schema)).toEqual(expected);
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

    const expected: PluginReplacePathData = {
      pluginName: "PluginA",
      paramsPath: [
        ["root", "name"],
        ["root", "child"],
      ],
      commands: [],
    };

    expect(createPluginParamDictionary("PluginA", schema)).toEqual(expected);
  });
  test("command with struct", () => {
    const schema: PluginSchemaArray = {
      structs: [
        {
          struct: "Vector2",
          params: [
            { name: "x", attr: { kind: "number", default: 0 } },
            { name: "y", attr: { kind: "number", default: 0 } },
          ],
        },
      ],
      params: [],
      commands: [
        {
          command: "move",
          args: [
            {
              name: "position",
              attr: { kind: "struct", struct: "Vector2", default: {} },
            },
          ],
        },
      ],
    };
    const expected: PluginReplacePathData = {
      pluginName: "PluginA",
      paramsPath: [],
      commands: [
        {
          commandName: "move",
          argsPath: [
            ["position", "x"],
            ["position", "y"],
          ],
        },
      ],
    };
    expect(createPluginParamDictionary("PluginA", schema)).toEqual(expected);
  });
});
