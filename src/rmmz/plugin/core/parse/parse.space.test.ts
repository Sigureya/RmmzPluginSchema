import { describe, test, expect } from "vitest";
import { parsePlugin } from "./parse";
import type {
  ParsedPlugin,
  PluginCommandTokens,
  PluginParamTokens,
} from "./types";

describe("parsePlugin - space in param names", () => {
  test("should parse parameters with spaces correctly", () => {
    const input: string[] = [
      "/*:",
      "@param first name",
      "@type string ",
      "@default Alice",

      "@param last name",
      "@type string",
      "@default Smith",
      "*/",
    ];

    const expected: PluginParamTokens[] = [
      {
        name: "first name",
        attr: {
          kind: "string",
          default: "Alice",
        },
      },
      {
        name: "last name",
        attr: {
          kind: "string",
          default: "Smith",
        },
      },
    ];

    const result: ParsedPlugin = parsePlugin(input.join("\n"));
    expect(result.params).toEqual(expected);
  });
  test("should parse commands with spaces correctly", () => {
    const input: string[] = [
      "/*:",
      "@command first command",
      "@text First Command",
      "@desc This is the first command",

      "@arg value1",
      "@type number",
      "@default 100",

      "@arg arg two",
      "@type string",
      "@default hello",
      "*/",
    ];
    const expected: PluginCommandTokens[] = [
      {
        command: "first command",
        desc: "This is the first command",
        text: "First Command",
        args: [
          {
            attr: { default: "100", kind: "number" },
            name: "value1",
          },
          {
            attr: { default: "hello", kind: "string" },
            name: "arg two",
          },
        ],
      },
    ];
    const result: ParsedPlugin = parsePlugin(input.join("\n"));
    expect(result.commands).toEqual(expected);
  });
});
