import { describe, expect, test } from "vitest";
import type { PluginSchemaArray } from "@RmmzPluginSchema/rmmz/plugin";
import { createDictionaryPP } from "./createDictionary";

describe("createDictionaryPP", () => {
  test("collects root scalar and string[] paths", () => {
    const schema: PluginSchemaArray = {
      commands: [],
      params: [
        {
          name: "title",
          attr: { kind: "string", default: "" },
        },
        {
          name: "names",
          attr: { kind: "string[]", default: [] },
        },
      ],
      structs: [],
    };

    const result = createDictionaryPP(schema);

    expect([...result.params].sort()).toEqual(["names", "names[]", "title"]);
    expect([...result.commands].sort()).toEqual([]);
  });

  test("collects nested paths for struct[] including string[] members", () => {
    const schema: PluginSchemaArray = {
      commands: [],
      params: [
        {
          name: "nameTables",
          attr: { kind: "struct[]", struct: "NameTable", default: [] },
        },
      ],
      structs: [
        {
          struct: "NameTable",
          params: [
            {
              name: "variableId",
              attr: { kind: "number", default: 0 },
            },
            {
              name: "names",
              attr: { kind: "string[]", default: [] },
            },
          ],
        },
      ],
    };

    const result = createDictionaryPP(schema);

    expect([...result.params].sort()).toEqual([
      "nameTables",
      "nameTables[].names",
      "nameTables[].names[]",
      "nameTables[].variableId",
    ]);
    expect([...result.commands].sort()).toEqual([]);
  });

  test("collects command arg paths including nested struct and arrays", () => {
    const schema: PluginSchemaArray = {
      commands: [
        {
          command: "changeName",
          args: [
            {
              name: "actorId",
              attr: { kind: "number", default: 0 },
            },
            {
              name: "selectListName",
              attr: { kind: "string", default: "" },
            },
            {
              name: "nameTable",
              attr: {
                kind: "struct[]",
                struct: "NameTable",
                default: [],
              },
            },
          ],
        },
      ],
      params: [],
      structs: [
        {
          struct: "NameTable",
          params: [
            {
              name: "variableId",
              attr: { kind: "number", default: 0 },
            },
            {
              name: "names",
              attr: { kind: "string[]", default: [] },
            },
          ],
        },
      ],
    };

    const result = createDictionaryPP(schema);

    expect([...result.params].sort()).toEqual([]);
    expect([...result.commands].sort()).toEqual([
      "changeName.actorId",
      "changeName.nameTable",
      "changeName.nameTable[].names",
      "changeName.nameTable[].names[]",
      "changeName.nameTable[].variableId",
      "changeName.selectListName",
    ]);
  });
});
