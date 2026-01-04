import { describe, expect, test } from "vitest";
import type { PluginStructTokens } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import { parsePlugin } from "@RmmzPluginSchema/rmmz/plugin/core/parse/parse";
import { createStructTokens } from "./tokens";
import type { PluginStructAnnotation } from "./types/schema";

describe("createStruct", () => {
  const structAnnotation: PluginStructAnnotation = {
    struct: "Person",
    locale: "ja",
    params: [
      {
        name: "@param name",
        base: { kind: "@type string" },
        attr: [],
        default: "@default John Doe",
      },
      {
        name: "@param age",
        base: { kind: "@type number" },
        attr: ["@min 0"],
        default: "@default 0",
      },
    ],
  };
  const expectedTokens: string[] = [
    "/*~struct~Person:ja",
    "@param name",
    "@type string",
    "@default John Doe",
    "",
    "@param age",
    "@type number",
    "@min 0",
    "@default 0",
    "",
    "*/",
  ];
  test("generates correct tokens for struct annotation", () => {
    const tokens = createStructTokens(structAnnotation);
    expect(tokens).toEqual(expectedTokens);
  });
  test("", () => {
    const struct: PluginStructTokens = {
      name: "Person",
      params: [
        {
          name: "name",
          attr: { kind: "string", default: "John Doe" },
        },
        {
          name: "age",
          attr: { kind: "number", min: "0", default: "0" },
        },
      ],
    };

    const lines = ["/*:ja", "*/", ...expectedTokens].join("\n");
    const result = parsePlugin(lines, "ja");
    expect(result.structs).toEqual([struct]);
  });
});
