import { readFile } from "fs/promises";
import { resolve } from "path";
import { describe, expect, test } from "vitest";
import { READ_PLUGIN_MESSAGES } from "./fileio";
import type { ParsedPlugin, PluginStructEx } from "./rmmz";
import {
  compilePluginAsArraySchema,
  parsePluginByLocale,
  parsePluginParamRecord2,
} from "./rmmz";
import { createDeepJSONParserHandlers } from "./rmmz/plugin/core/deepJSONHandler";

interface NameTable {
  variableId: number;
  names: string[];
}

const structNameTable: PluginStructEx<NameTable> = {
  struct: "NameTable",
  params: {
    variableId: { kind: "number", default: 0 },
    names: { kind: "string[]", default: [] },
  },
};

describe("PluginExtractionPipeline", () => {
  const expecetdParsedPlugin: ParsedPlugin = {
    locale: "ja",
    meta: {},
    commands: [],
    helpLines: [],
    dependencies: {
      base: [],
      orderBefore: [],
      orderAfter: [],
    },
    params: [
      { name: "value", attr: { kind: "number", default: "0" } },
      {
        name: "nameTable",
        attr: {
          kind: "struct<NameTable>[]",
          default: '["{\\"variableId\\":\\"0\\",\\"names\\":\\"[]\\"}"]',
        },
      },
    ],
    structs: [
      {
        name: "NameTable",
        params: [
          {
            name: "variableId",
            attr: { kind: "number", default: "0" },
          },
          {
            name: "names",
            attr: { kind: "string[]", default: "[]" },
          },
        ],
      },
    ],
  };
  test("loads plugins.js and builds schema from mock plugin", async () => {
    const root = resolve(process.cwd(), "src/mockPlugins");
    const pluginsJS = await readFile(resolve(root, "plugins.js"), "utf-8");
    const pluginList = parsePluginParamRecord2(pluginsJS, READ_PLUGIN_MESSAGES);

    expect(pluginList.complete).toBe(true);
    expect(pluginList.invalidPlugins).toBe(0);
    expect(pluginList.plugins).toHaveLength(1);
    expect(pluginList.plugins[0]?.name).toBe("mockPlugin");

    const pluginBody = await readFile(
      resolve(root, "plugins", "mockPlugin.js"),
      "utf-8",
    );
    const parsed = parsePluginByLocale(pluginBody);
    expect(parsed.params).toMatchObject(expecetdParsedPlugin.params);
    expect(parsed.structs).toMatchObject(expecetdParsedPlugin.structs);
    // expect(parsed.structs).toMatchObject([
    //   {
    //     name: "nameTable",
    //     params: [
    //       {
    //         name: "variableId",
    //         attr: { kind: "number", default: 0 },
    //       },
    //       {
    //         name: "names",
    //         attr: { kind: "string[]", default: [] },
    //       },
    //     ],
    //   },
    // ]);
  });
  test.skip("compile", () => {
    const schema = compilePluginAsArraySchema(
      expecetdParsedPlugin,
      createDeepJSONParserHandlers(),
    );

    const paramNameTable = {
      name: "nameTable",
      attr: {
        kind: "struct[]",
        struct: "NameTable",
        default: `[\"{\\\"variableId\\\":\\\"0\\\",\\\"names\\\":\\\"[]\\\"}\"]`,
      },
    };

    expect(schema.params).toMatchObject([
      { name: "value", attr: { kind: "number", default: 0 } },
      paramNameTable,
    ]);
    expect(schema.structs).toMatchObject([structNameTable]);
  });
});
