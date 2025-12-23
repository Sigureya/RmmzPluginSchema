import { describe, test, expect } from "vitest";
import { parsePlugin } from "./parse";
import type {
  ParsedPlugin,
  PluginParamTokens,
  StructParseState,
} from "./types/types";

const createTokens = (structHead: string) => {
  return [
    "/*:",
    "@param num",
    "@type number",
    "@default 10",
    "",
    "@param person",
    "@type struct<Person>",
    "@desc This is a person",
    "*/",

    structHead,
    "@param name",
    "@desc This is the name",
    "@type string",
    "@default bob",
    "@param age",
    "@type number",
    "@default 20",
    `*/`,
  ];
};

describe("parsePlugin", () => {
  describe("structs", () => {
    const tokens: string[] = createTokens(`/*~struct~Person`);
    const src: string = tokens.join("\n");
    test("commands is empty", () => {
      const result: ParsedPlugin = parsePlugin(src);
      expect(result.commands).toEqual([]);
    });
    test("params", () => {
      const result: ParsedPlugin = parsePlugin(src);
      const expected: PluginParamTokens[] = [
        {
          name: "num",
          attr: { kind: "number", default: "10" },
        },
        {
          name: "person",
          attr: {
            kind: "struct",
            struct: "Person",
            desc: "This is a person",
          },
        },
      ];
      expect(result.params).toEqual(expected);
    });
    test("structs is defined", () => {
      const result: ParsedPlugin = parsePlugin(src);
      const struct: StructParseState = {
        name: "Person",
        params: [
          {
            name: "name",
            attr: {
              kind: "string",
              default: "bob",
              desc: "This is the name",
            },
          },
          {
            name: "age",
            attr: {
              kind: "number",
              default: "20",
            },
          },
        ],
      };
      expect(result.structs).toEqual([struct]);
    });
  });
  describe("struct with locale", () => {
    const expectedStruct: StructParseState = {
      name: "Person",
      params: [
        {
          name: "name",
          attr: {
            kind: "string",
            default: "bob",
            desc: "This is the name",
          },
        },
        {
          name: "age",
          attr: {
            kind: "number",
            default: "20",
          },
        },
      ],
    };
    test("structs with locale is defined", () => {
      const tokens: string[] = createTokens(`/*~struct~Person:ja`);
      const src: string = tokens.join("\n");
      const result: ParsedPlugin = parsePlugin(src, "ja");
      expect(result.structs).toEqual([expectedStruct]);
    });
    test("structs with locale is defined", () => {
      const tokens: string[] = createTokens(`/*~struct~Person:ja  `);
      const src: string = tokens.join("\n");
      const result: ParsedPlugin = parsePlugin(src, "ja");
      expect(result.structs).toEqual([expectedStruct]);
    });
  });
});
