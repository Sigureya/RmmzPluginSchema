import { describe, test, expect, vi } from "vitest";
import type { PluginReplacePathData, PluginCommandPathMap } from "./features";
import {
  createPluginParamDictionary,
  replaceRuntimePluginCommand,
} from "./features";
import { createPluginCommandMap } from "./features/replace/build";
import type {
  PluginSchemaArray,
  PrimitiveParam,
  PluginCommandData,
} from "./rmmz";
import { filterPluginSchemaByFn, filterPluginSchemaStringParams } from "./rmmz";

const MOCK_OLD_TEXT = "oldTextA";
const MOCK_NEW_TEXT = "newTextA";
const MOCK_NON_REPLACE_TEXT = "nonReplaceText";
const MOCK_IGNOE_TEXT = "42";

const findNewText = (value: string): string | undefined => {
  if (value === MOCK_OLD_TEXT) {
    return MOCK_NEW_TEXT;
  }
  return undefined;
};

describe("PluiginSchemaArray", () => {
  const schema: PluginSchemaArray = {
    params: [
      { name: "gameTitle", attr: { kind: "string", default: "" } },
      { name: "maxPlayers", attr: { kind: "number", default: 4 } },
      { name: "randomTexts", attr: { kind: "string[]", default: [] } },
      { name: "persons", attr: { kind: "struct[]", struct: "Person" } },
    ],
    structs: [
      {
        struct: "Person",
        params: [
          { name: "name", attr: { kind: "string", default: "" } },
          { name: "age", attr: { kind: "number", default: 0 } },
        ],
      },
      {
        struct: "Vector2",
        params: [
          { name: "x", attr: { kind: "number", default: 0 } },
          { name: "y", attr: { kind: "number", default: 0 } },
        ],
      },
    ],
    commands: [
      {
        command: "cmd",
        args: [
          { name: "value", attr: { kind: "number", default: 0 } },
          { name: "note", attr: { kind: "string", default: "" } },
        ],
      },
      {
        command: "move",
        args: [
          { name: "position", attr: { kind: "struct", struct: "Vector2" } },
        ],
      },
    ],
  };
  test("createPluginParamDictionary", () => {
    const d2: PluginReplacePathData = {
      pluginName: "MockPlugin",
      paramsPath: [
        ["gameTitle"],
        ["maxPlayers"],
        ["randomTexts", "[]"],
        ["persons", "[]", "name"],
        ["persons", "[]", "age"],
      ],
      commands: [
        {
          commandName: "cmd",
          argsPath: [["value"], ["note"]],
        },
        {
          commandName: "move",
          argsPath: [
            ["position", "x"],
            ["position", "y"],
          ],
        },
      ],
    };
    const dictionary2 = createPluginParamDictionary("MockPlugin", schema);
    expect(dictionary2).toEqual(d2);
  });
  describe("filter", () => {
    test("all false", () => {
      const expected: PluginSchemaArray = {
        params: [],
        structs: [],
        commands: [],
      };
      const result = filterPluginSchemaByFn(schema, () => false);
      expect(result).toEqual(expected);
    });
    test("all true", () => {
      const result = filterPluginSchemaByFn(schema, () => true);
      expect(result).toEqual(schema);
    });
    test("number", () => {
      const fn = vi.fn((param: PrimitiveParam) => param.kind === "number");
      const expected: PluginSchemaArray = {
        params: [
          { name: "maxPlayers", attr: { kind: "number", default: 4 } },
          { name: "persons", attr: { kind: "struct[]", struct: "Person" } },
        ],
        structs: [
          {
            struct: "Person",
            params: [{ name: "age", attr: { kind: "number", default: 0 } }],
          },
          {
            struct: "Vector2",
            params: [
              { name: "x", attr: { kind: "number", default: 0 } },
              { name: "y", attr: { kind: "number", default: 0 } },
            ],
          },
        ],
        commands: [
          {
            command: "cmd",
            args: [{ name: "value", attr: { kind: "number", default: 0 } }],
          },
          {
            command: "move",
            args: [
              { name: "position", attr: { kind: "struct", struct: "Vector2" } },
            ],
          },
        ],
      };
      const result = filterPluginSchemaByFn(schema, fn);
      expect(fn).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
    describe("string", () => {
      const expected: PluginSchemaArray = {
        params: [
          { name: "gameTitle", attr: { kind: "string", default: "" } },
          { name: "randomTexts", attr: { kind: "string[]", default: [] } },
          { name: "persons", attr: { kind: "struct[]", struct: "Person" } },
        ],
        structs: [
          {
            struct: "Person",
            params: [{ name: "name", attr: { kind: "string", default: "" } }],
          },
        ],
        commands: [
          {
            command: "cmd",
            args: [{ name: "note", attr: { kind: "string", default: "" } }],
          },
        ],
      };
      test("filterPluginSchemaStringParams", () => {
        const result = filterPluginSchemaStringParams(schema);
        expect(result).toEqual(expected);
      });
      test("custom fn", () => {
        const fn = vi.fn(
          (param: PrimitiveParam) =>
            param.kind === "string" || param.kind === "string[]",
        );
        const result = filterPluginSchemaByFn(schema, fn);
        expect(fn).toHaveBeenCalled();
        expect(result).toEqual(expected);
      });
    });
  });
});

describe("replace command", () => {
  const command: PluginCommandData = {
    code: 357,
    indent: 0,
    parameters: [
      "MockPlugin",
      "NoPath",
      "",
      { note: MOCK_OLD_TEXT, value: MOCK_IGNOE_TEXT },
    ],
  };
  test("command not found", () => {
    const fn = vi.fn(findNewText);
    const result = replaceRuntimePluginCommand(command, new Map(), fn);
    expect(result).toEqual(command);
    expect(fn).not.toHaveBeenCalled();
  });
  test("command found but no paths", () => {
    const fn = vi.fn(findNewText);
    const result = replaceRuntimePluginCommand(
      command,
      new Map([["MockPlugin:NoPath", { argsPath: [] }]]),
      fn,
    );
    expect(result).toEqual(command);
    expect(fn).not.toHaveBeenCalled();
  });
  test("command found with paths", () => {
    const expectedCommand: PluginCommandData = {
      code: 357,
      indent: 0,
      parameters: [
        "MockPlugin",
        "NoPath",
        "",
        { note: MOCK_NEW_TEXT, value: MOCK_IGNOE_TEXT },
      ],
    };
    const fn = vi.fn(findNewText);
    const result = replaceRuntimePluginCommand(
      command,
      new Map([["MockPlugin:NoPath", { argsPath: [["note"]] }]]),
      fn,
    );
    expect(result).toEqual(expectedCommand);
    expect(fn).toHaveBeenCalledWith(MOCK_OLD_TEXT);
    expect(fn).not.toHaveBeenCalledWith(MOCK_IGNOE_TEXT);
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test("text not found", () => {
    const notFoundCommand: PluginCommandData = {
      code: 357,
      indent: 0,
      parameters: [
        "MockPlugin",
        "PathOk",
        "",
        { note: MOCK_NON_REPLACE_TEXT, value: MOCK_IGNOE_TEXT },
      ],
    };
    const fn = vi.fn(findNewText);
    const result = replaceRuntimePluginCommand(
      notFoundCommand,
      new Map([["MockPlugin:PathOk", { argsPath: [["note"]] }]]),
      fn,
    );
    expect(result).toEqual(notFoundCommand);
    expect(fn).toHaveBeenCalledWith(MOCK_NON_REPLACE_TEXT);
    expect(fn).not.toHaveBeenCalledWith(MOCK_IGNOE_TEXT);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("replace pipeline", () => {
  const replacePathList: PluginReplacePathData = {
    pluginName: "MockPlugin",
    paramsPath: [],
    commands: [
      { commandName: "cmd", argsPath: [["note"]] },
      { commandName: "RandomMessage", argsPath: [["message", "[]"]] },
    ],
  };
  const schema: PluginSchemaArray = {
    params: [],
    structs: [],
    commands: [
      {
        command: "cmd",
        args: [{ name: "note", attr: { kind: "string", default: "" } }],
      },
      {
        command: "RandomMessage",
        args: [{ name: "message", attr: { kind: "string[]", default: [] } }],
      },
    ],
  };
  describe("command", () => {
    const pluginCommandMap: PluginCommandPathMap = new Map([
      [
        "MockPlugin:RandomMessage",
        {
          argsPath: [["message", "[]"]],
        },
      ],
      ["MockPlugin:cmd", { argsPath: [["note"]] }],
    ]);
    test("1:createPluginParamDictionary", () => {
      const result = createPluginParamDictionary(
        replacePathList.pluginName,
        schema,
      );
      expect(result).toEqual(replacePathList);
    });
    test("2:createPluginCommandMap", () => {
      const map = createPluginCommandMap([replacePathList]);
      expect(map).toEqual(pluginCommandMap);
    });
    describe("3:replaceRuntimePluginCommand", () => {
      test("string", () => {
        const command: PluginCommandData = {
          code: 357,
          indent: 0,
          parameters: [
            "MockPlugin",
            "cmd",
            "",
            { note: MOCK_OLD_TEXT, value: MOCK_IGNOE_TEXT },
          ],
        };
        const expectedCommand: PluginCommandData = {
          code: 357,
          indent: 0,
          parameters: [
            "MockPlugin",
            "cmd",
            "",
            { note: MOCK_NEW_TEXT, value: MOCK_IGNOE_TEXT },
          ],
        };
        const fn = vi.fn(findNewText);
        const result = replaceRuntimePluginCommand(
          command,
          pluginCommandMap,
          fn,
        );
        expect(result).toEqual(expectedCommand);
        expect(fn).toHaveBeenCalledWith(MOCK_OLD_TEXT);
        expect(fn).not.toHaveBeenCalledWith(MOCK_IGNOE_TEXT);
      });
      test("string[]", () => {
        const command: PluginCommandData = {
          code: 357,
          indent: 0,
          parameters: [
            "MockPlugin",
            "RandomMessage",
            "",
            {
              message: JSON.stringify([
                MOCK_OLD_TEXT,
                MOCK_IGNOE_TEXT,
                MOCK_NON_REPLACE_TEXT,
              ]),
            },
          ],
        };
        const expectedCommand: PluginCommandData = {
          code: 357,
          indent: 0,
          parameters: [
            "MockPlugin",
            "RandomMessage",
            "",
            {
              message: JSON.stringify([
                MOCK_NEW_TEXT,
                MOCK_IGNOE_TEXT,
                MOCK_NON_REPLACE_TEXT,
              ]),
            },
          ],
        };
        const fn = vi.fn(findNewText);
        const result = replaceRuntimePluginCommand(
          command,
          pluginCommandMap,
          fn,
        );
        expect(result).toEqual(expectedCommand);
        expect(fn).toHaveBeenCalledWith(MOCK_OLD_TEXT);
        expect(fn).not.toHaveBeenCalledWith(MOCK_IGNOE_TEXT);
      });
    });
  });
});
