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
  mock: MockParseResult
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
  return [...lines.body, ...lines.structs.map((struct) => struct)].join("\n");
};

describe("generatePluginAnnotationLines", () => {
  describe("empty", () => {
    const schema: PluginSchema = {
      target: "MZ",
      locale: undefined,
      pluginName: "TestPlugin",
      meta: {
        author: "Test Author",
        plugindesc: "This is a test plugin.",
        url: undefined,
      },
      dependencies: { base: [], orderBefore: [], orderAfter: [] },
      schema: { params: [], structs: [], commands: [] },
    };
    const tokenLines: PluginAnnotationLines = {
      structs: [],
      body: [
        "/*:",
        "@target MZ",
        "@author Test Author",
        "@plugindesc This is a test plugin.",
        "",
        "*/",
      ],
    };
    test("generates correct annotation lines for empty schema", () => {
      const handlers = createStringifyHandlers();
      const result = generatePluginAnnotationLines(schema, handlers);
      expect(result).toEqual(tokenLines);
      expect(handlers.numberArray).not.toHaveBeenCalled();
      expect(handlers.structArray).not.toHaveBeenCalled();
      expect(handlers.stringArray).not.toHaveBeenCalled();
      expect(handlers.struct).not.toHaveBeenCalled();
    });
    test("parses correct schema from annotation lines", () => {
      const handlers = createValueParserHandlers({
        object: {},
        objectArray: [],
        stringArray: [],
      });
      const result: PluginSchema = pluginSourceToArraySchema(
        {
          source: joinLines(tokenLines),
          pluginName: "TestPlugin",
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
  describe("s", () => {
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
