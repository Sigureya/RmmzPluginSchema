import type { MockedObject } from "vitest";
import { vi, describe, test, expect } from "vitest";
import type {
  PluginSchema,
  DeepJSONParserHandlers,
} from "@RmmzPluginSchema/rmmz/plugin";
import { pluginSourceToArraySchema } from "@RmmzPluginSchema/rmmz/plugin";
import { generatePluginAnnotationLines } from "./generator";
import type { SchemaStringifyHandlers, PluginAnnotationLines } from "./types";

const createStringifyHandlers = (): MockedObject<SchemaStringifyHandlers> => ({
  numberArray: vi.fn(),
  structArray: vi.fn(),
  stringArray: vi.fn(),
  struct: vi.fn(),
});

const createValueParserHandlers = (): MockedObject<DeepJSONParserHandlers> => ({
  parseObject: vi.fn(),
  parseObjectArray: vi.fn(),
  parseStringArray: vi.fn(),
});

const joinLines = (lines: PluginAnnotationLines): string => {
  return [...lines.body, ...lines.structs.flatMap((struct) => struct)].join(
    "\n"
  );
};

describe("generatePluginAnnotationLines", () => {
  describe("empty", () => {
    const schema: PluginSchema = {
      target: "MZ",
      locale: undefined,
      pluginName: "TestPlugin",
      meta: {
        author: undefined,
        plugindesc: undefined,
        url: undefined,
      },
      dependencies: { base: [], orderBefore: [], orderAfter: [] },
      schema: { params: [], structs: [], commands: [] },
    };
    const tokenLines: PluginAnnotationLines = {
      structs: [],
      body: ["/*:", "@target MZ", "", "*/"],
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
      const handlers = createValueParserHandlers();
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
  describe("minimal", () => {
    const schema: PluginSchema = {
      target: "MZ",
      locale: "ja",
      pluginName: "TestPlugin",
      meta: {
        author: "Test Author",
        plugindesc: "This is a test plugin.",
        url: "URL",
      },
      dependencies: {
        base: ["ABC"],
        orderBefore: ["DEF"],
        orderAfter: ["GHI"],
      },
      schema: {
        params: [],
        structs: [],
        commands: [],
      },
    };
    const tokenLines: PluginAnnotationLines = {
      structs: [],
      body: [
        "/*:ja",
        "@target MZ",
        "@author Test Author",
        "@plugindesc This is a test plugin.",
        "@url URL",
        "",
        "@base ABC",
        "@orderBefore DEF",
        "@orderAfter GHI",
        "",
        "*/",
      ],
    };
    test("generates correct annotation lines for minimal schema", () => {
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
          pluginName: "TestPlugin",
          locale: "ja",
        },
        handlers
      );
      expect(result).toEqual(schema);
    });
  });
});
