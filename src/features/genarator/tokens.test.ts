import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { PluginInput } from "@RmmzPluginSchema/rmmz/index";
import { pluginSourceToArraySchema } from "@RmmzPluginSchema/rmmz/index";
import type { PluginStructTokens } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import { parsePlugin } from "@RmmzPluginSchema/rmmz/plugin/core/parse/parse";
import { generatePluginAnnotation } from "./generator";
import {
  generateStructTokenBlock,
  generatePluginBodyTokenBlock,
} from "./tokens";
import type { PluginStructAnnotation } from "./types/schema";
import type { SchemaStringifyHandlers } from "./types/stringlfy";
import type {
  PluginAnnotationTokens,
  PluginBodyBlockToken,
  StructTokenBlock,
} from "./types/tokens";

const createHandlers = (): MockedObject<SchemaStringifyHandlers> => ({
  numberArray: vi.fn(),
  structArray: vi.fn(),
  stringArray: vi.fn(),
  struct: vi.fn(),
});

describe("generatePluginBodyTokenBlock", () => {
  describe("generates correct tokens for plugin annotations", () => {
    const pluginAnnoations: PluginAnnotationTokens = {
      target: "@target MZ",
      locale: "ja",
      meta: {
        author: "@author Test Author",
        pluginDesc: "@plugindesc This is a test plugin.",
        url: undefined,
      },
      dependencies: {
        base: ["@base ABC"],
        orderBefore: ["@orderBefore DEF"],
        orderAfter: ["@orderAfter GHI"],
      },
      schema: {
        commands: [
          {
            command: "@command ShowMessage",
            desc: undefined,
            text: undefined,
            args: [
              {
                name: "@arg message",
                base: {
                  kind: "@type string",
                  desc: undefined,
                  text: undefined,
                  parent: undefined,
                },
                attr: [],
                default: "@default Hello World",
              },
            ],
          },
        ],
        params: [
          {
            name: "@param globalParam",
            base: {
              kind: "@type boolean",
              desc: undefined,
              text: undefined,
              parent: undefined,
            },
            attr: [],
            default: "@default true",
          },
        ],
        structs: [],
      },
    };
    const expectedTokens: PluginBodyBlockToken = [
      "/*:ja",
      "@target MZ",
      "@author Test Author",
      "@plugindesc This is a test plugin.",
      "",
      "@base ABC",
      "@orderBefore DEF",
      "@orderAfter GHI",
      "",
      "@command ShowMessage",
      "@arg message",
      "@type string",
      "@default Hello World",
      "",
      "@param globalParam",
      "@type boolean",
      "@default true",
      "",
      "*/",
    ];
    test("generates plugin body tokens correctly", () => {
      const tokens = generatePluginBodyTokenBlock(pluginAnnoations);
      expect(tokens).toEqual(expectedTokens);
    });
    test("parses plugin body tokens correctly", () => {
      const input: PluginInput = {
        source: expectedTokens.join("\n"),
        pluginName: "TestPlugin",
        locale: "ja",
      };
      const schema = pluginSourceToArraySchema(input);
      const handlers = createHandlers();
      const result: PluginAnnotationTokens = generatePluginAnnotation(
        schema,
        handlers
      );
      expect(handlers.stringArray).not.toHaveBeenCalled();
      expect(handlers.numberArray).not.toHaveBeenCalled();
      expect(handlers.structArray).not.toHaveBeenCalled();
      expect(handlers.struct).not.toHaveBeenCalled();
      expect(result).toEqual(pluginAnnoations);
    });
  });
});

describe("generateStructTokenBlock", () => {
  const structAnnotation: PluginStructAnnotation = {
    struct: "Person",
    locale: "ja",

    params: [
      {
        name: "@param name",
        base: {
          kind: "@type string",
          desc: "@desc it's a name",
          text: undefined,
          parent: undefined,
        },
        attr: [],
        default: "@default John Doe",
      },
      {
        name: "@param age",
        base: {
          kind: "@type number",
          desc: undefined,
          text: undefined,
          parent: undefined,
        },
        attr: ["@min 0"],
        default: "@default 0",
      },
    ],
  };
  const expectedTokens: StructTokenBlock = [
    "/*~struct~Person:ja",
    "@param name",
    "@type string",
    "@desc it's a name",
    "@default John Doe",
    "",
    "@param age",
    "@type number",
    "@min 0",
    "@default 0",
    "",
    "*/",
  ];
  test("generates correct tokens for struct annotation", () => {
    const tokens = generateStructTokenBlock(structAnnotation);
    expect(tokens).toEqual(expectedTokens);
  });
  test("parses struct tokens correctly", () => {
    const struct: PluginStructTokens = {
      name: "Person",
      params: [
        {
          name: "name",
          attr: { kind: "string", default: "John Doe", desc: "it's a name" },
        },
        {
          name: "age",
          attr: { kind: "number", min: "0", default: "0" },
        },
      ],
    };

    const lines = ["/*:ja", "*/", ...expectedTokens].join("\n");
    const result = parsePlugin(lines, "ja");
    expect(result.structs).toEqual([struct]);
  });
});
