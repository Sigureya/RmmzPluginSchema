import { describe, test, expect } from "vitest";
import { parsePlugin } from "./parse";
import type { ParsedPlugin, PluginParamTokens } from "./types";

describe("parsePlugin", () => {
  test("should parse parameters correctly", () => {
    const mockTexts: string[] = [
      "/*:",
      "@param data",
      "@type number",
      "@min 0",
      "@max 200",
      "@decimals 2",
      "@default 123",
      "*/",
    ];
    const result: ParsedPlugin = parsePlugin(mockTexts.join("\n"));

    const expected: PluginParamTokens[] = [
      {
        name: "data",
        attr: {
          kind: "number",
          min: "0",
          max: "200",
          decimals: "2",
          default: "123",
        },
      },
    ];
    expect(result.params).toEqual(expected);
  });
  test("should parse parameters correctly", () => {
    const mockTexts: string[] = [
      "/*:",
      "@param data",
      "@type string",
      "@default ",
      "*/",
    ];
    const result: ParsedPlugin = parsePlugin(mockTexts.join("\n"));

    const expected: PluginParamTokens[] = [
      {
        name: "data",
        attr: {
          kind: "string",
          default: "",
        },
      },
    ];
    expect(result.params).toEqual(expected);
  });
  test("", () => {
    const mockTexts: string[] = [
      "/*:",
      "@param data ",
      "@type string ",
      "@default ",
      "*/",
    ];
    const result: ParsedPlugin = parsePlugin(mockTexts.join("\n"));

    const expected: PluginParamTokens[] = [
      {
        name: "data",
        attr: {
          kind: "string",
          default: "",
        },
      },
    ];
    expect(result.params).toEqual(expected);
  });
  test("all attributes", () => {
    const mockTexts: string[] = [
      "/*:",
      "@param data",
      "@min 0",
      "@max 200",
      "@decimals 2",
      "@on enable",
      "@off disable",
      "@dir img/pictures/",
      "@parent ppp",
      "*/",
    ];
    const expected: PluginParamTokens[] = [
      {
        name: "data",
        attr: {
          min: "0",
          max: "200",
          decimals: "2",
          on: "enable",
          off: "disable",
          dir: "img/pictures/",
          parent: "ppp",
        },
      },
    ];
    const result: ParsedPlugin = parsePlugin(mockTexts.join("\n"));
    expect(result.params).toEqual(expected);
  });
});
