import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { PluginSchema } from "@RmmzPluginSchema/rmmz/plugin";
import { generatePluginAnnotationLines } from "./generator";
import type { SchemaStringifyHandlers, PluginAnnotationLines } from "./types";
const createHandlers = (): MockedObject<SchemaStringifyHandlers> => ({
  numberArray: vi.fn(),
  structArray: vi.fn(),
  stringArray: vi.fn(),
  struct: vi.fn(),
});

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
    test("generates correct annotation lines for empty schema", () => {
      const expected: PluginAnnotationLines = {
        structs: [],
        body: [
          "/*:",
          "@target MZ",
          "@author Test Author",
          "@plugindesc This is a test plugin.",
          "",
          "",
          "*/",
        ],
      };
      const handlers = createHandlers();
      const result = generatePluginAnnotationLines(schema, handlers);
      expect(result).toEqual(expected);
      expect(handlers.numberArray).not.toHaveBeenCalled();
      expect(handlers.structArray).not.toHaveBeenCalled();
      expect(handlers.stringArray).not.toHaveBeenCalled();
      expect(handlers.struct).not.toHaveBeenCalled();
    });
  });
});
