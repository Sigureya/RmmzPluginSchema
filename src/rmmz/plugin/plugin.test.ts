import { test, expect, describe } from "vitest";
import {
  paramObjectFromPluginRecord,
  pluginSourceToJSON,
  pluginSourceToArraySchema,
} from "./plugin";
import type { PluginParamsRecord } from "./pluginsJS/types";
import type { PluginInput } from "./types";

describe("plugin", () => {
  describe("paramObjectFromPluginRecord", () => {
    test("converts PluginParamsRecord to JSONValue object with correct values", () => {
      const mockRecord: PluginParamsRecord = {
        name: "TestPlugin",
        status: true,
        description: "A test plugin",
        parameters: {
          param1: "value1",
          param2: "123",
          param3: "true",
          param4: "3.14",
          param5: "[]",
        },
      };

      const result = paramObjectFromPluginRecord(mockRecord);

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(result).toEqual({
        param1: "value1",
        param2: 123,
        param3: true,
        param4: 3.14,
        param5: [],
      });
    });

    test("preserves string values as-is when not parseable", () => {
      const mockRecord: PluginParamsRecord = {
        name: "StringPlugin",
        status: true,
        description: "A plugin with string values",
        parameters: {
          text: "Hello World",
          path: "/path/to/file",
          mixed: "someValue123",
        },
      };

      const result = paramObjectFromPluginRecord(mockRecord);

      expect(result.text).toBe("Hello World");
      expect(result.path).toBe("/path/to/file");
      expect(result.mixed).toBe("someValue123");
    });

    test("handles empty parameters", () => {
      const mockRecord: PluginParamsRecord = {
        name: "EmptyPlugin",
        status: true,
        description: "A plugin with no parameters",
        parameters: {},
      };

      const result = paramObjectFromPluginRecord(mockRecord);

      expect(result).toEqual({});
    });

    test("handles JSON object parameters", () => {
      const mockRecord: PluginParamsRecord = {
        name: "JSONPlugin",
        status: true,
        description: "A plugin with JSON parameters",
        parameters: {
          jsonParam: '{"key": "value", "number": 42}',
          nestedJson: '{"nested": {"prop": "test"}}',
        },
      };

      const result = paramObjectFromPluginRecord(mockRecord);

      expect(result.jsonParam).toEqual({ key: "value", number: 42 });
      expect(result.nestedJson).toEqual({ nested: { prop: "test" } });
    });
  });

  describe("pluginSourceToJSON", () => {
    test("parses valid plugin source text with correct meta information", () => {
      const pluginSource = `
        /*:
         * @plugindesc A sample plugin
         * @author Test Author
         * @url test-url
         * @param testParam
         * @type string
         * @desc A test parameter
         * @default test value
         */
      `;

      const result = pluginSourceToJSON(pluginSource);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("target");
      expect(result).toHaveProperty("meta");
      expect(result).toHaveProperty("commands");
      expect(result).toHaveProperty("params");
      expect(result).toHaveProperty("structs");
      expect(typeof result.meta).toBe("object");
      expect(typeof result.commands).toBe("object");
      expect(typeof result.params).toBe("object");
      expect(typeof result.structs).toBe("object");
    });

    test("correctly extracts meta fields", () => {
      const pluginSource = `
        /*:
         * @plugindesc Test Plugin Description
         * @author TestAuthor
         * @url test-url
         */
      `;

      const result = pluginSourceToJSON(pluginSource);

      expect(result.meta).toBeDefined();
      expect(result.meta.plugindesc).toBe("Test Plugin Description");
      expect(result.meta.author).toBe("TestAuthor");
      expect(result.meta.url).toBe("test-url");
    });

    test("handles minimal plugin source", () => {
      const pluginSource = `
        /*:
         * @plugindesc Minimal Plugin
         */
      `;

      const result = pluginSourceToJSON(pluginSource);

      expect(result).toBeInstanceOf(Object);
      expect(typeof result.target).toBe("string");
      expect(result.meta.plugindesc).toBe("Minimal Plugin");
    });

    test("parses command parameters correctly", () => {
      const pluginSource = `
        /*:
         * @plugindesc Plugin with commands
         * @command testCommand
         * @text Test Command
         * @desc A test command
         * @arg arg1
         * @type string
         * @default default value
         */
      `;

      const result = pluginSourceToJSON(pluginSource);

      expect(result.commands).toBeDefined();
      expect(typeof result.commands).toBe("object");
    });
  });

  describe("pluginSourceToArraySchema", () => {
    test("converts PluginInput to PluginSchema with correct target and locale", () => {
      const input: PluginInput = {
        source: `
          /*:
           * @plugindesc A test schema plugin
           * @author Test
           * @param testParam
           * @type string
           * @desc Test parameter
           * @default defaultValue
           */
        `,
        locale: "en_US",
        pluginName: "TestSchemaPlugin",
      };

      const result = pluginSourceToArraySchema(input);

      expect(result).toBeDefined();
      expect(result.locale).toBe("en_US");
      expect(result.pluginName).toBe("TestSchemaPlugin");
      expect(result.target).toBe("MZ");
      expect(result.schema).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(typeof result.dependencies).toBe("object");
    });

    test("handles undefined locale property", () => {
      const input: PluginInput = {
        source: `
          /*:
           * @plugindesc A plugin without locale
           * @author NoLocaleAuthor
           */
        `,
        locale: undefined,
        pluginName: "NoLocalePlugin",
      };

      const result = pluginSourceToArraySchema(input);

      expect(result.pluginName).toBe("NoLocalePlugin");
      expect(result.target).toBe("MZ");
      expect(result.locale).toBeUndefined();
      expect(result.schema).toBeDefined();
    });

    test("preserves plugin metadata with correct values", () => {
      const input: PluginInput = {
        source: `
          /*:
           * @plugindesc CorrectDescription
           * @author CorrectAuthor
           * @url test-url
           */
        `,
        locale: "ja_JP",
        pluginName: "MetadataPlugin",
      };

      const result = pluginSourceToArraySchema(input);

      expect(result.meta).toBeDefined();
      expect(result.meta.plugindesc).toBe("CorrectDescription");
      expect(result.meta.author).toBe("CorrectAuthor");
      expect(result.meta.url).toBe("test-url");
    });

    test("uses default parser when parser argument is omitted", () => {
      const input: PluginInput = {
        source: `
          /*:
           * @plugindesc Test with default parser
           * @param param1
           * @type string
           */
        `,
        locale: "en_US",
        pluginName: "DefaultParserPlugin",
      };

      const resultWithDefault = pluginSourceToArraySchema(input);
      const resultWithExplicitDefault = pluginSourceToArraySchema(
        input,
        undefined,
      );

      expect(resultWithDefault).toBeDefined();
      expect(resultWithExplicitDefault).toBeDefined();
      expect(resultWithDefault.pluginName).toBe("DefaultParserPlugin");
      expect(resultWithExplicitDefault.pluginName).toBe("DefaultParserPlugin");
      expect(resultWithDefault.schema).toBeDefined();
      expect(resultWithExplicitDefault.schema).toBeDefined();
    });

    test("correctly sets target to MZ for all inputs", () => {
      const testCases: PluginInput[] = [
        {
          source: "/*:\n * @plugindesc Test1\n */",
          locale: "en_US",
          pluginName: "Plugin1",
        },
        {
          source: "/*:\n * @plugindesc Test2\n */",
          locale: "ja_JP",
          pluginName: "Plugin2",
        },
        {
          source: "/*:\n * @plugindesc Test3\n */",
          locale: undefined,
          pluginName: "Plugin3",
        },
      ];

      testCases.forEach((testCase) => {
        const result = pluginSourceToArraySchema(testCase);
        expect(result.target).toBe("MZ");
      });
    });

    test("maintains locale through schema conversion", () => {
      const locales = ["en_US", "ja_JP", "fr_FR", "de_DE"];

      locales.forEach((locale) => {
        const input: PluginInput = {
          source: `/*: @plugindesc Test locale ${locale} */`,
          locale: locale,
          pluginName: `TestPlugin_${locale}`,
        };

        const result = pluginSourceToArraySchema(input);

        expect(result.locale).toBe(locale);
      });
    });

    test("handles complex plugin source with multiple parameters", () => {
      const input: PluginInput = {
        source: `
          /*:
           * @plugindesc Complex Plugin
           * @author ComplexAuthor
           * @param param1
           * @type string
           * @desc First parameter
           * @default value1
           * 
           * @param param2
           * @type number
           * @desc Second parameter
           * @default 42
           * 
           * @command testCmd
           * @text Test Command
           */
        `,
        locale: "en_US",
        pluginName: "ComplexPlugin",
      };
      const expected = {
        dependencies: {
          base: [],
          orderAfter: [],
          orderBefore: [],
        },
        locale: "en_US",
        meta: {
          author: "ComplexAuthor",
          plugindesc: "Complex Plugin",
        },
        pluginName: "ComplexPlugin",
        schema: {
          commands: [
            {
              args: [],
              command: "testCmd",
              desc: undefined,
              text: "Test Command",
            },
          ],
          params: [
            {
              attr: {
                default: "value1",
                desc: "First parameter",
                kind: "string",
              },
              name: "param1",
            },
            {
              attr: {
                default: 42,
                desc: "Second parameter",
                kind: "number",
              },
              name: "param2",
            },
          ],
          structs: [],
        },
        target: "MZ",
      };

      const result = pluginSourceToArraySchema(input);
      expect(result).toEqual(expected);
    });
  });
});
