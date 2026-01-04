import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type {
  DeepJSONParserHandlers,
  PluginSchema,
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
});
