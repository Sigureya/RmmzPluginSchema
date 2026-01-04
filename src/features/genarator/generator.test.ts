import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type {
  DeepJSONParserHandlers,
  ParamError,
  PluginSchema,
} from "@RmmzPluginSchema/rmmz/plugin";
import { pluginSourceToArraySchema } from "@RmmzPluginSchema/rmmz/plugin";
import type { DeepParseResult } from "@RmmzPluginSchema/rmmz/plugin/core/rmmzJSON/types/handlers";
import { generatePluginAnnotationLines } from "./generator";
import type { SchemaStringifyHandlers, PluginAnnotationLines } from "./types";

const createStringifyHandlers = (): MockedObject<SchemaStringifyHandlers> => ({
  numberArray: vi.fn(),
  structArray: vi.fn(),
  stringArray: vi.fn(),
  struct: vi.fn((obj: object) => JSON.stringify(obj)),
});

interface MockParseResult {
  object: object;
  objectArray: object[];
  stringArray: string[];
}

const createValueParserHandlers = (
  mock: MockParseResult = {
    object: {},
    objectArray: [],
    stringArray: [],
  }
): MockedObject<DeepJSONParserHandlers> => ({
  parseObject: vi.fn<(json: string) => DeepParseResult<object, ParamError>>(
    () => ({
      value: mock.object,
      errors: [],
    })
  ),
  parseObjectArray: vi.fn<
    (json: string) => DeepParseResult<object[], ParamError>
  >(() => ({
    value: mock.objectArray,
    errors: [],
  })),
  parseStringArray: vi.fn(),
});

const joinLines = (lines: PluginAnnotationLines): string => {
  return [...lines.body, ...lines.structs.flatMap((struct) => struct)].join(
    "\n"
  );
};

describe("generatePluginAnnotationLines", () => {
  describe("all scalar types", () => {
    const schema: PluginSchema = {
      target: "MZ",
      locale: undefined,
      pluginName: "AllScalarTypesPlugin",
      meta: {
        author: "Test Author",
        plugindesc: "Plugin with all scalar parameter types.",
        url: undefined,
      },
      dependencies: { base: [], orderBefore: [], orderAfter: [] },
      schema: {
        params: [
          {
            name: "booleanParam",
            attr: { kind: "boolean", default: true, on: "ON", off: "OFF" },
          },
          {
            name: "stringParam",
            attr: { kind: "string", default: "STRING" },
          },
          {
            name: "multiLineStringParam",
            attr: { kind: "multiline_string", default: "LINE1\\nLINE2" },
          },
          {
            name: "fileParam",
            attr: { kind: "file", default: "actor1", dir: "img/pictures" },
          },
          {
            name: "selectParam",
            attr: {
              kind: "select",
              default: "option1",
              options: [
                { option: "hayate", value: "E2" },
                { option: "komachi", value: "E3" },
              ],
            },
          },
          {
            name: "comboParam",
            attr: {
              kind: "combo",
              default: "optionA",
              options: ["optionA", "optionB", "optionC"],
            },
          },
          {
            name: "numberParam",
            attr: { kind: "number", default: 42, min: 0, max: 100 },
          },
          { name: "actorParam", attr: { kind: "actor", default: 1 } },
          { name: "classParam", attr: { kind: "class", default: 2 } },
          { name: "skillParam", attr: { kind: "skill", default: 3 } },
          { name: "itemParam", attr: { kind: "item", default: 4 } },
          { name: "weaponParam", attr: { kind: "weapon", default: 5 } },
          { name: "armorParam", attr: { kind: "armor", default: 6 } },
          { name: "enemyParam", attr: { kind: "enemy", default: 7 } },
          { name: "troopParam", attr: { kind: "troop", default: 8 } },
          { name: "stateParam", attr: { kind: "state", default: 9 } },
          {
            name: "commonEventParam",
            attr: { kind: "common_event", default: 10 },
          },
        ],
        structs: [],
        commands: [],
      },
    };
    const tokenLines: PluginAnnotationLines = {
      structs: [],
      body: [
        "/*:",
        "@target MZ",
        "@author Test Author",
        "@plugindesc Plugin with all scalar parameter types.",
        "",
        "@param booleanParam",
        "@type boolean",
        "@on ON",
        "@off OFF",
        "@default true",
        "",
        "@param stringParam",
        "@type string",
        "@default STRING",
        "",
        "@param multiLineStringParam",
        "@type multiline_string",
        "@default LINE1\\nLINE2",
        "",
        "@param fileParam",
        "@type file",
        "@dir img/pictures",
        "@default actor1",
        "",
        "@param selectParam",
        "@type select",
        "@option hayate",
        "@value E2",
        "@option komachi",
        "@value E3",
        "@default option1",
        "",
        "@param comboParam",
        "@type combo",
        "@option optionA",
        "@option optionB",
        "@option optionC",
        "@default optionA",
        "",
        "@param numberParam",
        "@type number",
        "@min 0",
        "@max 100",
        "@default 42",
        "",
        "@param actorParam",
        "@type actor",
        "@default 1",
        "",
        "@param classParam",
        "@type class",
        "@default 2",
        "",
        "@param skillParam",
        "@type skill",
        "@default 3",
        "",
        "@param itemParam",
        "@type item",
        "@default 4",
        "",
        "@param weaponParam",
        "@type weapon",
        "@default 5",
        "",
        "@param armorParam",
        "@type armor",
        "@default 6",
        "",
        "@param enemyParam",
        "@type enemy",
        "@default 7",
        "",
        "@param troopParam",
        "@type troop",
        "@default 8",
        "",
        "@param stateParam",
        "@type state",
        "@default 9",
        "",
        "@param commonEventParam",
        "@type common_event",
        "@default 10",
        "",
        "*/",
      ],
    };
    test("generates correct annotation lines for schema with all scalar types", () => {
      const handlers = createStringifyHandlers();
      const result = generatePluginAnnotationLines(schema, handlers);
      expect(result).toEqual(tokenLines);
      expect(handlers.numberArray).not.toHaveBeenCalled();
      expect(handlers.structArray).not.toHaveBeenCalled();
      expect(handlers.stringArray).not.toHaveBeenCalled();
      expect(handlers.struct).not.toHaveBeenCalled();
    });
    test("parses correct schema from annotation lines", () => {
      const handlers = createValueParserHandlers();
      const result: PluginSchema = pluginSourceToArraySchema(
        {
          source: joinLines(tokenLines),
          pluginName: "AllScalarTypesPlugin",
          locale: undefined,
        },
        handlers
      );
      expect(result).toEqual(schema);
      expect(handlers.parseObject).not.toHaveBeenCalled();
      expect(handlers.parseObjectArray).not.toHaveBeenCalled();
      expect(handlers.parseStringArray).not.toHaveBeenCalled();
    });
  });
  describe("schema with struct parameter and struct array parameter", () => {
    const person = {
      name: "Bob",
      age: 0,
    };
    const schema: PluginSchema = {
      target: "MZ",
      locale: undefined,
      pluginName: "PersonPlugin",
      meta: {
        author: "Test Author",
        plugindesc: "Plugin to define a Person struct.",
      },
      dependencies: { base: [], orderBefore: [], orderAfter: [] },
      schema: {
        commands: [],
        params: [
          {
            name: "mockPerson",
            attr: {
              kind: "struct",
              struct: "Person",
              default: person,
              desc: "A person struct parameter.",
              text: "Person Parameter",
            },
          },
        ],
        structs: [
          {
            struct: "Person",
            params: [
              {
                name: "name",
                attr: {
                  kind: "string",
                  default: "John Doe",
                  desc: "The name of the person.",
                  text: "Name",
                },
              },
              {
                name: "age",
                attr: {
                  kind: "number",
                  default: 0,
                  desc: "The age of the person.",
                  text: "Age",
                },
              },
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
      },
    };
    const tokenLines: PluginAnnotationLines = {
      body: [
        "/*:",
        "@target MZ",
        "@author Test Author",
        "@plugindesc Plugin to define a Person struct.",
        "",
        "@param mockPerson",
        "@type struct<Person>",
        "@desc A person struct parameter.",
        "@text Person Parameter",
        '@default {"name":"Bob","age":0}',
        "",
        "*/",
      ],
      structs: [
        [
          "/*~struct~Person:",
          "@param name",
          "@type string",
          "@desc The name of the person.",
          "@text Name",
          "@default John Doe",
          "",
          "@param age",
          "@type number",
          "@desc The age of the person.",
          "@text Age",
          "@default 0",
          "",
          "*/",
        ],
        [
          "/*~struct~Vector2:",
          "@param x",
          "@type number",
          "@default 0",
          "",
          "@param y",
          "@type number",
          "@default 0",
          "",
          "*/",
        ],
      ],
    };
    test("generates correct annotation lines for schema with struct", () => {
      const handlers = createStringifyHandlers();
      const result = generatePluginAnnotationLines(schema, handlers);
      expect(result).toEqual(tokenLines);
      expect(handlers.numberArray).not.toHaveBeenCalled();
      expect(handlers.structArray).not.toHaveBeenCalled();
      expect(handlers.stringArray).not.toHaveBeenCalled();
    });
    test("parses correct schema from annotation lines", () => {
      const handlers = createValueParserHandlers({
        object: person,
        objectArray: [],
        stringArray: [],
      });
      const result: PluginSchema = pluginSourceToArraySchema(
        {
          source: joinLines(tokenLines),
          pluginName: "PersonPlugin",
          locale: undefined,
        },
        handlers
      );
      expect(result).toEqual(schema);
      expect(handlers.parseObjectArray).not.toHaveBeenCalled();
      expect(handlers.parseStringArray).not.toHaveBeenCalled();
    });
  });
});
