import { describe, test, expect } from "vitest";
import type { PluginSchema } from "@RmmzPluginSchema/rmmz/plugin";
import { pluginSourceToArraySchema } from "@RmmzPluginSchema/rmmz/plugin/plugin";
import { JSONPathJS } from "jsonpath-js";
import { extractCommandArgsByKey } from "./command";
import type {
  CommandMapKey,
  CommandArgExtractors,
  CommandExtractResult,
} from "./extractor/types";
import { createPluginValueExtractor } from "./schema";
import type { PluginExtractorBundle } from "./types";

interface AddItemCommandArgs {
  itemId: number;
  quantity: number;
}

const pluginAnnoations: string[] = [
  "/*:",
  "@command AddItem",
  "@arg itemId",
  "@type item",
  "@default 0",
  "@arg quantity",
  "@type number",
  "@default 1",
  "@desc Adds an item to the inventory.",
  "",
  "@param itemMessage",
  "@type string",
  "@default You obtained an item!",
  "@desc Message displayed when an item is added.",
  "",
  "@param effect",
  "@type struct<Effect>",
  "@text Effect details",
  "*/",

  "/*~struct~Effect:",
  "@param power",
  "@type number",
  "@default 100",
  "@param effectMessage",
  "@type string",
  "@default It was super effective!",
  "*/",
];

const schema: PluginSchema = {
  meta: {},
  pluginName: "MockPlugin",
  target: "MZ",
  schema: {
    params: [
      {
        name: "itemMessage",
        attr: {
          default: "You obtained an item!",
          kind: "string",
          desc: "Message displayed when an item is added.",
        },
      },
      {
        name: "effect",
        attr: {
          kind: "struct",
          struct: "Effect",
          text: "Effect details",
        },
      },
    ],
    structs: [
      {
        struct: "Effect",
        params: [
          {
            name: "power",
            attr: { kind: "number", default: 100 },
          },
          {
            name: "effectMessage",
            attr: { kind: "string", default: "It was super effective!" },
          },
        ],
      },
    ],
    commands: [
      {
        command: "AddItem",
        desc: undefined,
        text: undefined,
        args: [
          {
            attr: {
              default: 0,
              kind: "item",
            },
            name: "itemId",
          },
          {
            attr: {
              default: 1,
              desc: "Adds an item to the inventory.",
              kind: "number",
            },
            name: "quantity",
          },
        ],
      },
    ],
  },
};

describe("JSONPath", () => {
  test("pluginSourceToArraySchema", () => {
    const result: PluginSchema = pluginSourceToArraySchema(
      "MockPlugin",
      pluginAnnoations.join("\n")
    );
    expect(result).toEqual(schema);
  });
  const bundle: PluginExtractorBundle = createPluginValueExtractor(
    "MockPlugin",
    schema.schema,
    (path) => new JSONPathJS(path)
  );
  test("extractCommandArgsByKey", () => {
    type MapType = Map<CommandMapKey, CommandArgExtractors>;

    const commandMap: MapType = new Map(bundle.commands);
    const args = {
      itemId: 5,
      quantity: 10,
    } as const satisfies AddItemCommandArgs;
    const values: CommandExtractResult = {
      pluginName: "MockPlugin",
      commandName: "AddItem",
      values: [
        {
          category: "struct",
          name: "item",
          param: {
            name: "itemId",
            attr: {
              kind: "item",
              default: 0,
            },
          },
          roootName: "AddItem",
          rootType: "args",
          value: 5,
        },
        {
          category: "struct",
          name: "number",
          param: {
            name: "quantity",
            attr: {
              default: 1,
              kind: "number",
              desc: "Adds an item to the inventory.",
            },
          },
          roootName: "AddItem",
          rootType: "args",
          value: 10,
        },
      ],
    };
    const result = extractCommandArgsByKey(
      args,
      "MockPlugin:AddItem",
      commandMap
    );
    expect(result).not.toBeUndefined();
    expect(result?.commandName).toBe("AddItem");
    expect(result?.pluginName).toBe("MockPlugin");
    expect(result).toEqual(values);
  });
});
