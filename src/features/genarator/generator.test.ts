import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type {
  DeepJSONParserHandlers,
  PluginSchema,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  createDeepJSONParserHandlers,
  parseDeepJSON,
  pluginSourceToArraySchema,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  generatePluginAnnotationLines,
  generatePluginAnnotationText,
} from "./generator";
import type { SchemaStringifyHandlers, PluginAnnotationLines } from "./types";

const createStringifyHandlers = (): MockedObject<SchemaStringifyHandlers> => ({
  numberArray: vi.fn(),
  structArray: vi.fn(),
  stringArray: vi.fn(),
  struct: vi.fn((obj: object) => JSON.stringify(obj)),
});

interface MockParseResult {
  objects: Map<string | undefined, object>;
  objectArray: Map<string, object[]>;
  stringArray: Map<string, string[]>;
}

const createDeepJSONParseHandlerMock =
  (): MockedObject<DeepJSONParserHandlers> => ({
    parseObject: vi.fn<DeepJSONParserHandlers["parseObject"]>((json) => {
      return {
        value: parseDeepJSON(json) as object,
        errors: [],
      };
    }),
    parseObjectArray: vi.fn<DeepJSONParserHandlers["parseObjectArray"]>(() => ({
      value: [],
      errors: [],
    })),
    parseStringArray: vi.fn(),
  });

const createValueParserHandlers = (
  mock: MockParseResult = {
    objects: new Map(),
    objectArray: new Map<string, object[]>(),
    stringArray: new Map<string, string[]>(),
  },
): MockedObject<DeepJSONParserHandlers> => ({
  parseObject: vi.fn<DeepJSONParserHandlers["parseObject"]>((a, context) => {
    const obj = mock.objects.get(context.attr.struct);
    if (obj) {
      return {
        value: obj,
        errors: [],
      };
    }

    throw new Error(`Unexpected struct type: ${context.attr.struct}`);
  }),
  parseObjectArray: vi.fn<DeepJSONParserHandlers["parseObjectArray"]>(() => ({
    value: [],
    errors: [],
  })),
  parseStringArray: vi.fn(),
});

const joinLines = (lines: PluginAnnotationLines): string => {
  return [...lines.body, ...lines.structs.flatMap((struct) => struct)].join(
    "\n",
  );
};
const person = {
  name: "Bob",
  age: 0,
};
const schema: PluginSchema = {
  target: "MZ",
  locale: "",
  pluginName: "PersonPlugin",
  meta: {
    author: "Test Author",
    plugindesc: "Plugin to define a Person struct.",
  },
  dependencies: {
    base: ["base1"],
    orderBefore: ["before2"],
    orderAfter: ["after3"],
  },
  schema: {
    commands: [
      {
        command: "SetPosition",
        text: "Set Position",
        desc: "Sets the position of a character.",
        args: [
          { name: "target", attr: { kind: "number", default: 0 } },
          {
            name: "position",
            attr: {
              kind: "struct",
              struct: "Vector2",
              default: { x: 0, y: 0 },
            },
          },
        ],
      },
    ],
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
    "@base base1",
    "@orderBefore before2",
    "@orderAfter after3",
    "",
    "@command SetPosition",
    "@text Set Position",
    "@desc Sets the position of a character.",
    "@arg target",
    "@type number",
    "@default 0",
    "",
    "@arg position",
    "@type struct<Vector2>",
    '@default {"x":0,"y":0}',
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

describe("generatePluginAnnotationLines", () => {
  describe("schema with struct parameter and struct array parameter", () => {
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
        objects: new Map<string, object>([
          ["Person", person],
          ["Vector2", { x: 0, y: 0 }],
        ]),
        objectArray: new Map<string, object[]>(),
        stringArray: new Map<string, string[]>(),
      });
      const result: PluginSchema = pluginSourceToArraySchema(
        {
          source: joinLines(tokenLines),
          pluginName: "PersonPlugin",
          locale: "",
        },
        handlers,
      );
      expect(result).toEqual(schema);
      expect(handlers.parseObjectArray).not.toHaveBeenCalled();
      expect(handlers.parseStringArray).not.toHaveBeenCalled();
    });
    test("deepJSON", () => {
      const handlers = createDeepJSONParseHandlerMock();
      const result: PluginSchema = pluginSourceToArraySchema(
        {
          source: joinLines(tokenLines),
          pluginName: "PersonPlugin",
          locale: "",
        },
        handlers,
      );
      expect(result).toEqual(schema);
      expect(handlers.parseStringArray).not.toHaveBeenCalled();
      expect(handlers.parseObjectArray).not.toHaveBeenCalled();
    });
    test("throws error for unexpected struct type", () => {
      const handlers: DeepJSONParserHandlers = {
        parseObject: () => {
          throw new Error("Unexpected struct type: UnknownStruct");
        },
        parseObjectArray: () => {
          throw new Error("Unexpected struct type: UnknownStruct");
        },
        parseStringArray: () => {
          throw new Error("Unexpected struct type: UnknownStruct");
        },
      };
      expect(() =>
        pluginSourceToArraySchema(
          {
            source: joinLines(tokenLines),
            pluginName: "PersonPlugin",
            locale: "",
          },
          handlers,
        ),
      ).toThrow();
    });
  });
});

describe("generatePluginAnnotationText", () => {
  test("generates correct annotation text for schema with struct", () => {
    const handlers = createStringifyHandlers();
    const result: string = generatePluginAnnotationText(schema, handlers);
    const expected = joinLines(tokenLines);
    expect(result).toBe(expected);
    expect(handlers.numberArray).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
  });
});

describe("round-trip consistency", () => {
  test("generate and parse", () => {
    const stringifyHandlers = createStringifyHandlers();
    const generatedLines = generatePluginAnnotationLines(
      schema,
      stringifyHandlers,
    );
    const generatedText: string = joinLines(generatedLines);
    const parseHandlers = createDeepJSONParserHandlers();
    const parsedSchema: PluginSchema = pluginSourceToArraySchema(
      {
        source: generatedText,
        pluginName: "PersonPlugin",
        locale: "",
      },
      parseHandlers,
    );
    expect(parsedSchema).toEqual(schema);
  });
});
