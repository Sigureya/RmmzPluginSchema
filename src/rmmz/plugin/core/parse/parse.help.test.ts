import { describe, test, expect } from "vitest";
import { parsePluginByLocale, parsePlugin } from "./parse";
import type {
  ParsedPlugin,
  PluginCommandTokens,
  PluginParamTokens,
} from "./types";

const mockInput: string[] = [
  "/*:",
  "@command save",
  "@arg arg1",
  "@type number",
  "@default 123",

  "@param gameTitle",
  "@type string",
  "@default 'My Game'",

  "@help",
  "aaaa",
  "bbbb",
  "cccc",

  "@param data",
  "@type number",
  "@default 123",

  "@command load",
  "@arg slot",
  "@type number",
  "@default 1",
  "*/",
];

const expectedParams: PluginParamTokens[] = [
  { name: "gameTitle", attr: { kind: "string", default: "'My Game'" } },
  { name: "data", attr: { kind: "number", default: "123" } },
];
const expectedCommands: PluginCommandTokens[] = [
  {
    command: "save",
    args: [{ name: "arg1", attr: { kind: "number", default: "123" } }],
  },
  {
    command: "load",
    args: [{ name: "slot", attr: { kind: "number", default: "1" } }],
  },
];

const helpLines: string[] = ["aaaa", "bbbb", "cccc"];
describe("parsePluginByLocale", () => {
  test("should parse plugin annotations correctly", () => {
    const result: ParsedPlugin = parsePluginByLocale(mockInput.join("\n"));
    expect(result.meta).toBeDefined();
    expect(result.helpLines).toEqual(helpLines);
  });
  test("should parse parameters correctly", () => {
    const result: ParsedPlugin = parsePluginByLocale(mockInput.join("\n"));
    expect(result.params).toEqual(expectedParams);
  });
  test("should parse commands correctly", () => {
    const result: ParsedPlugin = parsePluginByLocale(mockInput.join("\n"));

    expect(result.commands).toEqual(expectedCommands);
  });
});

describe("parsePlugin", () => {
  test("should parse plugin annotations correctly", () => {
    const result: ParsedPlugin[] = parsePlugin(mockInput.join("\n"));
    expect(result.length).toBe(1);
    expect(result[0].meta).toBeDefined();
    expect(result[0].helpLines).toEqual(helpLines);
  });
  test("should parse parameters correctly", () => {
    const result: ParsedPlugin[] = parsePlugin(mockInput.join("\n"));
    expect(result[0].params).toEqual(expectedParams);
  });
  test("should parse commands correctly", () => {
    const result: ParsedPlugin[] = parsePlugin(mockInput.join("\n"));
    expect(result[0].commands).toEqual(expectedCommands);
  });
});
