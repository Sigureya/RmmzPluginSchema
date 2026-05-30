import { readFile } from "fs/promises";
import { resolve } from "path";
import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import { READ_PLUGIN_MESSAGES } from "./fileio";
import type {
  DeepJSONParserHandlers,
  ParsedPlugin,
  PluginParam,
  PluginParamTokens,
} from "./rmmz";
import {
  compilePluginAsArraySchema,
  parseDeepJSON,
  parsePluginByLocale,
  parsePluginParamRecord2,
} from "./rmmz";

const createDeepJSONParserHandlersX =
  (): MockedObject<DeepJSONParserHandlers> => {
    return {
      parseObject: vi.fn(),
      parseObjectArray: vi.fn<DeepJSONParserHandlers["parseObjectArray"]>(
        (json) => {
          const obj = parseDeepJSON(json);
          if (Array.isArray(obj)) {
            return {
              errors: [],
              value: obj as object[],
            };
          }
          return {
            errors: [],
            value: [],
          };
        },
      ),
      parseStringArray: vi.fn<DeepJSONParserHandlers["parseStringArray"]>(
        (json: string) => {
          return {
            errors: [],
            value: JSON.parse(json),
          };
        },
      ),
    };
  };

describe("PluginExtractionPipeline", () => {
  const nameTableTokens: PluginParamTokens = {
    name: "nameTable",
    attr: {
      kind: "struct[]",
      struct: "NameTable",
      default: '["{\\"variableId\\":\\"0\\",\\"names\\":\\"[]\\"}"]',
    },
  };
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
      nameTableTokens,
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
  });
  test("compile", () => {
    const handlers = createDeepJSONParserHandlersX();
    const schema = compilePluginAsArraySchema(expecetdParsedPlugin, handlers);

    const expectedParams: PluginParam[] = [
      {
        attr: {
          default: 0,
          kind: "number",
        },
        name: "value",
      },
      {
        name: "nameTable",
        attr: {
          kind: "struct[]",
          struct: "NameTable",
          default: [{ names: [], variableId: 0 }],
        },
      },
    ];
    const names: PluginParamTokens = {
      attr: {
        default: `[]`,
        kind: "string[]",
      },
      name: "names",
    };

    expect(handlers.parseObject).not.toHaveBeenCalled();
    expect(handlers.parseObjectArray).toHaveBeenCalledWith(
      nameTableTokens.attr.default,
      nameTableTokens,
    );
    expect(handlers.parseStringArray).toHaveBeenCalledWith(
      names.attr.default,
      names,
    );
    expect(schema.params).toEqual(expectedParams);
  });
});
