import { describe, test, expect } from "vitest";
import { parsePlugin } from "./parse";
import type {
  ParsedPlugin,
  PluginCommandTokens,
  PluginDependencies,
  StructParseState,
} from "./types";

describe("parsePlugin", () => {
  const input = [
    "/*~struct~MyStruct:ja",
    "@param param1",
    "@text パラメータ1",
    "@type number",
    "*/",

    "/*~struct~MyStruct",
    "@param param1",
    "@text Parameter 1",
    "@type number",
    "*/",

    "/*:",
    "@command save",
    "@text writeSave",
    "@desc write Save File",
    "@arg arg1",
    "@text arg1 text",
    "@type number",
    "@default 123",

    "@base ABC",
    "*/",

    "/*:ja",
    "@command 保存",
    "@text セーブを書き込む",
    "@desc セーブファイルを書き込みます",
    "@arg arg1",
    "@text 引数1のテキスト",
    "@type number",
    "@default 123",

    "@base XYZ",
    "*/",
  ].join("\n");

  test("should parse plugin with locale 'ja' correctly", () => {
    const expectedCommands: PluginCommandTokens[] = [
      {
        command: "保存",
        text: "セーブを書き込む",
        desc: "セーブファイルを書き込みます",
        args: [
          {
            name: "arg1",
            attr: { kind: "number", text: "引数1のテキスト", default: "123" },
          },
        ],
      },
    ];
    const expectedStructs: StructParseState[] = [
      {
        name: "MyStruct",
        params: [
          {
            name: "param1",
            attr: { kind: "number", text: "パラメータ1" },
          },
        ],
      },
    ];
    const dep: PluginDependencies = {
      base: ["XYZ"],
      orderBefore: [],
      orderAfter: [],
    };

    const result: ParsedPlugin = parsePlugin(input, "ja");
    expect(result.commands).toEqual(expectedCommands);
    expect(result.structs).toEqual(expectedStructs);
    expect(result.dependencies).toEqual(dep);
  });
  test("should parse plugin with locale 'en' correctly", () => {
    const expectedCommands: PluginCommandTokens[] = [
      {
        command: "save",
        text: "writeSave",
        desc: "write Save File",
        args: [
          {
            name: "arg1",
            attr: { kind: "number", text: "arg1 text", default: "123" },
          },
        ],
      },
    ];
    const expectedStructs: StructParseState[] = [
      {
        name: "MyStruct",
        params: [
          {
            name: "param1",
            attr: { kind: "number", text: "Parameter 1" },
          },
        ],
      },
    ];
    const dep: PluginDependencies = {
      base: ["ABC"],
      orderBefore: [],
      orderAfter: [],
    };

    const result: ParsedPlugin = parsePlugin(input, "en");
    expect(result.commands).toEqual(expectedCommands);
    expect(result.structs).toEqual(expectedStructs);
    expect(result.dependencies).toEqual(dep);
  });
});
