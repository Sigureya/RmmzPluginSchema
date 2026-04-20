import { describe, test, expect } from "vitest";
import { parsePlugin, parsePluginByLocale } from "./parse";
import type {
  ParsedPlugin,
  PluginCommandTokens,
  PluginDependencies,
  PluginStructTokens,
} from "./types";
const input: string = [
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

describe("parsePlugin", () => {
  const expectedCommandsJA: PluginCommandTokens[] = [
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
  const expectedStructsJA: PluginStructTokens[] = [
    {
      name: "MyStruct",
      params: [
        { name: "param1", attr: { kind: "number", text: "パラメータ1" } },
      ],
    },
  ];
  test("should parse plugin with locale 'ja' correctly", () => {
    const dep: PluginDependencies = {
      base: ["XYZ"],
      orderBefore: [],
      orderAfter: [],
    };

    const result: ParsedPlugin = parsePluginByLocale(input, "ja");
    expect(result.commands).toEqual(expectedCommandsJA);
    expect(result.structs).toEqual(expectedStructsJA);
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
    const expectedStructs: PluginStructTokens[] = [
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

    const result: ParsedPlugin = parsePluginByLocale(input, "en");
    expect(result.commands).toEqual(expectedCommands);
    expect(result.structs).toEqual(expectedStructs);
    expect(result.dependencies).toEqual(dep);
  });

  test("parsePlugin should return all locales", () => {
    const expected: ParsedPlugin[] = [
      {
        locale: "",
        commands: [
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
        ],
        params: [],
        helpLines: [],
        meta: {},
        dependencies: {
          base: ["ABC"],
          orderBefore: [],
          orderAfter: [],
        },
        structs: [
          {
            name: "MyStruct",
            params: [
              {
                name: "param1",
                attr: { kind: "number", text: "Parameter 1" },
              },
            ],
          },
        ],
      },
      {
        locale: "ja",
        commands: expectedCommandsJA,
        params: [],
        helpLines: [],
        meta: {},
        dependencies: {
          base: ["XYZ"],
          orderBefore: [],
          orderAfter: [],
        },
        structs: expectedStructsJA,
      },
    ];
    const result: ParsedPlugin[] = parsePlugin(input);
    expect(result).toHaveLength(2);
    expect(result).toEqual(expected);
  });
});
