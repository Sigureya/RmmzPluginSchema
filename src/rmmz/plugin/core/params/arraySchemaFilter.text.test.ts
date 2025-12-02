import { describe, expect, test } from "vitest";
import { filterPluginParamByText } from "./arraySchemaFilter";
import type { PluginSchemaArray, PluginStructSchemaArrayEx } from "./types";

interface MockData {
  message: string;
  select: string;
  combo: string;
  multiline: string;
  messageArray: string[];
  multilineArray: string[];
  items: Item[];
  numberArray: number[];
}

interface Item {
  name: string;
  price: number;
}

const itemSchema: PluginStructSchemaArrayEx<Item> = {
  struct: "Item",
  params: [
    { name: "name", attr: { kind: "string", default: "" } },
    { name: "price", attr: { kind: "number", default: 0 } },
  ],
};

const structSchema: PluginStructSchemaArrayEx<MockData> = {
  struct: "MockData",
  params: [
    { name: "message", attr: { kind: "string", default: "" } },
    {
      name: "select",
      attr: { kind: "select", default: "option1", options: [] },
    },
    { name: "combo", attr: { kind: "combo", default: "choice1", options: [] } },
    { name: "multiline", attr: { kind: "multiline_string", default: "" } },
    { name: "messageArray", attr: { kind: "string[]", default: [] } },
    {
      name: "multilineArray",
      attr: { kind: "multiline_string[]", default: [] },
    },
    { name: "items", attr: { kind: "struct[]", struct: "Item" } },
  ],
};

describe("filterPluginSchemaByStringParam", () => {
  test("", () => {
    const schema: PluginSchemaArray = {
      structs: [structSchema, itemSchema],
      commands: [],
      params: [],
    };
    const result = filterPluginParamByText(schema);
    const expected: PluginSchemaArray = {
      structs: [
        structSchema,
        {
          struct: "Item",
          params: [{ name: "name", attr: { kind: "string", default: "" } }],
        },
      ],
      commands: [],
      params: [],
    };
    expect(result).toEqual(expected);
  });
  test("", () => {
    const schema: PluginSchemaArray = {
      structs: [
        {
          struct: "Item",
          params: [
            { name: "name", attr: { kind: "string", default: "" } },
            { name: "price", attr: { kind: "number", default: 0 } },
          ],
        },
      ],
      commands: [
        {
          command: "DefineItem",
          args: [
            { name: "item", attr: { kind: "struct", struct: "Item" } },
            { name: "dummy", attr: { kind: "number", default: 0 } },
          ],
        },
      ],
      params: [
        { name: "gameId", attr: { kind: "number", default: 1 } },
        { name: "title", attr: { kind: "string", default: "My Game" } },
      ],
    };
    const result = filterPluginParamByText(schema);
    const expected: PluginSchemaArray = {
      structs: [
        {
          struct: "Item",
          params: [{ name: "name", attr: { kind: "string", default: "" } }],
        },
      ],
      commands: [
        {
          command: "DefineItem",
          args: [{ name: "item", attr: { kind: "struct", struct: "Item" } }],
        },
      ],
      params: [{ name: "title", attr: { kind: "string", default: "My Game" } }],
    };
    expect(result).toEqual(expected);
  });
  test("file", () => {
    const schema: PluginSchemaArray = {
      structs: [
        {
          struct: "Item",
          params: [
            { name: "name", attr: { kind: "string", default: "" } },
            { name: "price", attr: { kind: "number", default: 0 } },
          ],
        },
        {
          struct: "Banner",
          params: [
            {
              name: "image",
              attr: { kind: "file", default: "", dir: "img/banners" },
            },
            { name: "text", attr: { kind: "string", default: "" } },
          ],
        },
      ],
      commands: [
        {
          command: "ShowPicture",
          args: [
            {
              name: "fileName",
              attr: { kind: "file", default: "", dir: "img/pictures" },
            },
            { name: "id", attr: { kind: "number", default: 1 } },
          ],
        },
      ],
      params: [
        { name: "gameId", attr: { kind: "number", default: 1 } },
        { name: "title", attr: { kind: "string", default: "My Game" } },
      ],
    };
    const expected: PluginSchemaArray = {
      structs: [
        {
          struct: "Item",
          params: [{ name: "name", attr: { kind: "string", default: "" } }],
        },
        {
          struct: "Banner",
          params: [{ name: "text", attr: { kind: "string", default: "" } }],
        },
      ],
      commands: [],
      params: [{ name: "title", attr: { kind: "string", default: "My Game" } }],
    };
    const result = filterPluginParamByText(schema);
    expect(result.structs).toEqual(expected.structs);
    expect(result.params).toEqual(expected.params);
    expect(result.commands).toEqual(expected.commands);
    expect(result).toEqual(expected);
  });
});

describe("filterPluginParamByText", () => {
  describe("keeps params that have a text attribute", () => {
    test("", () => {
      const schema: PluginSchemaArray = {
        params: [
          {
            name: "gameTitle",
            attr: {
              kind: "string",
              default: "My RPG",
              text: "Title of the game",
            },
          },
        ],
        structs: [],
        commands: [
          {
            command: "Play scrolling text",
            args: [
              {
                name: "text",
                attr: {
                  kind: "multiline_string",
                  default: "",
                  text: "Text to scroll on the screen",
                },
              },
            ],
          },
        ],
      };
      const result = filterPluginParamByText(schema);
      expect(result).toEqual(schema);
    });
  });
  describe("removes params that do not have a text attribute", () => {
    test("", () => {
      const schema: PluginSchemaArray = {
        structs: [
          {
            struct: "BgmSettings",
            params: [
              {
                name: "name",
                attr: {
                  kind: "file",
                  default: "",
                  dir: "audio/bgm",
                  text: "BGM file name",
                },
              },
              {
                name: "volume",
                attr: { kind: "number", default: 90 },
              },
            ],
          },
        ],
        commands: [
          {
            command: "PlayBgm",
            args: [
              {
                name: "bgm",
                attr: { kind: "file", default: "", dir: "audio/bgm" },
              },
              {
                name: "volume",
                attr: { kind: "number", default: 90, text: "Volume level" },
              },
            ],
          },
          {
            command: "ShowPicture",
            args: [
              {
                name: "pictureId",
                attr: { kind: "number", default: 1 },
              },
              {
                name: "pictureFile",
                attr: {
                  kind: "file",
                  default: "",
                  dir: "img/pictures",
                  text: "Picture file name",
                },
              },
              {
                name: "x",
                attr: { kind: "number", default: 0 },
              },
              {
                name: "y",
                attr: { kind: "number", default: 0 },
              },
            ],
          },
        ],
        params: [
          {
            name: "bgm",
            attr: {
              kind: "file",
              default: "",
              dir: "audio/bgm",
              text: "Sound file to play",
            },
          },
          {
            name: "rondomSounds",
            attr: {
              kind: "file[]",
              default: [],
              dir: "audio/se",
            },
          },
          {
            name: "titleImage",
            attr: {
              kind: "file",
              default: "",
              dir: "img/titles",
            },
          },
        ],
      };
      const expected: PluginSchemaArray = {
        commands: [],
        structs: [],
        params: [],
      };
      const result = filterPluginParamByText(schema);
      expect(result).toEqual(expected);
    });
    test("filters schema to only include params with text attribute", () => {
      const schema: PluginSchemaArray = {
        structs: [
          {
            struct: "Vector2",
            params: [
              { name: "x", attr: { kind: "number", default: 0 } },
              { name: "y", attr: { kind: "number", default: 0 } },
            ],
          },
          {
            struct: "Enemy",
            params: [
              {
                name: "enemyId",
                attr: { kind: "enemy", default: 1, text: "ID of the enemy" },
              },
              {
                name: "position",
                attr: { kind: "struct", struct: "Vector2" },
              },
            ],
          },
        ],
        commands: [
          {
            command: "AddVariableValue",
            args: [
              {
                name: "variableId",
                attr: { kind: "variable", default: 1 },
              },
              {
                name: "value",
                attr: { kind: "number", default: 0, text: "Value to add" },
              },
            ],
          },
        ],
        params: [
          {
            name: "num",
            attr: { kind: "number", default: 0 },
          },
          {
            name: "numArray",
            attr: { kind: "number[]", default: [1, 2, 3] },
          },
          {
            name: "bool",
            attr: { kind: "boolean", default: false },
          },
        ],
      };
      const expected: PluginSchemaArray = {
        commands: [],
        params: [],
        structs: [],
      };
      const result = filterPluginParamByText(schema);
      expect(result).toEqual(expected);
    });
  });
});
