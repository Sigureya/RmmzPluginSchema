import { describe, expect, it } from "vitest";
import { splitBlock } from "./block";
import type { Block, PluginBodyBlock, PluginStructBlock } from "./types";

describe("splitBlock", () => {
  describe("normal case", () => {
    const lines: string[] = [
      "/*:",
      "@plugindesc mock",
      "*/",

      "/*~struct~Vector2:ja",
      "@param x",
      "@type number",
      "@default 0",
      "@param y",
      "@type number",
      "@default 0",
      "*/",
    ];

    const expected: Block = {
      bodies: [
        {
          lines: ["@plugindesc mock"],
        },
      ],
      structs: [
        {
          struct: "Vector2",
          locale: "ja",
          lines: [
            "@param x",
            "@type number",
            "@default 0",
            "@param y",
            "@type number",
            "@default 0",
          ],
        },
      ],
    };

    const block: string = lines.join("\n");
    const result: Block = splitBlock(block);
    it("should split block into bodies", () => {
      expect(result.bodies).toEqual(expected.bodies);
    });
    it("should split block into structs", () => {
      expect(result.structs).toEqual(expected.structs);
    });
  });

  describe("locale in body", () => {
    it("should handle locale in body", () => {
      const lines: string[] = ["/*:ja", "@plugindesc モック", "*/"];
      const expectedBodies: PluginBodyBlock[] = [
        {
          locale: "ja",
          lines: ["@plugindesc モック"],
        },
      ];

      const result = splitBlock(lines.join("\n"));
      expect(result.bodies).toEqual(expectedBodies);
    });
    it("locale blank", () => {
      const lines: string[] = ["/*: ", "@plugindesc mock", "*/"];
      const expectedBodies: PluginBodyBlock[] = [
        {
          locale: undefined,
          lines: ["@plugindesc mock"],
        },
      ];
      const result = splitBlock(lines.join("\n"));
      expect(result.bodies).toEqual(expectedBodies);
    });

    it("should handle multiple locales", () => {
      const lines: string[] = [
        "/*:",
        "@plugindesc mock",
        "*/",
        "/*:ja",
        "@plugindesc モック",
        "*/",
      ];
      const expectedBodies: PluginBodyBlock[] = [
        {
          lines: ["@plugindesc mock"],
          locale: undefined,
        },
        {
          locale: "ja",
          lines: ["@plugindesc モック"],
        },
      ];

      const result = splitBlock(lines.join("\n"));
      expect(result.bodies).toEqual(expectedBodies);
    });
    it("should handle locale in both body and struct", () => {
      const lines: string[] = [
        "/*:ja",
        "@plugindesc モック",
        "*/",
        "/*~struct~Vector2:ja",
        "@param x",
        "@type number",
        "@default 0",
        "@param y",
        "@type number",
        "@default 0",
        "*/",
      ];
      const expectedBodies: PluginBodyBlock[] = [
        {
          locale: "ja",
          lines: ["@plugindesc モック"],
        },
      ];
      const expectedStructs: PluginStructBlock[] = [
        {
          struct: "Vector2",
          locale: "ja",
          lines: [
            "@param x",
            "@type number",
            "@default 0",
            "@param y",
            "@type number",
            "@default 0",
          ],
        },
      ];
      const result = splitBlock(lines.join("\n"));
      expect(result.bodies).toEqual(expectedBodies);
      expect(result.structs).toEqual(expectedStructs);
    });
    it("should handle struct without locale", () => {
      const lines: string[] = [
        "/*:ja",
        "@plugindesc モック",
        "*/",
        "/*~struct~Vector2",
        "@param x",
        "@type number",
        "@default 0",
        "@param y",
        "@type number",
        "@default 0",
        "*/",
      ];
      const expectedBodies: PluginBodyBlock[] = [
        {
          locale: "ja",
          lines: ["@plugindesc モック"],
        },
      ];
      const expectedStructs: PluginStructBlock[] = [
        {
          struct: "Vector2",
          lines: [
            "@param x",
            "@type number",
            "@default 0",
            "@param y",
            "@type number",
            "@default 0",
          ],
        },
      ];
      const result = splitBlock(lines.join("\n"));
      expect(result.bodies).toEqual(expectedBodies);
      expect(result.structs).toEqual(expectedStructs);
    });
    it("full locale test", () => {
      const lines: string[] = [
        "/*:",
        "@plugindesc mock",
        "*/",

        "/*:ja",
        "@plugindesc モック",
        "*/",

        "/*:ge",
        "@plugindesc Spott",
        "*/",

        "/*~struct~Vector2:ja",
        "@param x",
        "@type number",
        "@text X座標",
        "@default 0",
        "@param y",
        "@type number",
        "@text Y座標",
        "@default 0",
        "*/",

        "/*~struct~Vector2",
        "@param x",
        "@type number",
        "@default 0",
        "@param y",
        "@type number",
        "@default 0",
        "*/",
      ];
      const expectedBodies: PluginBodyBlock[] = [
        {
          lines: ["@plugindesc mock"],
        },
        {
          locale: "ja",
          lines: ["@plugindesc モック"],
        },
        {
          locale: "ge",
          lines: ["@plugindesc Spott"],
        },
      ];
      const expectedStructs: PluginStructBlock[] = [
        {
          struct: "Vector2",
          locale: "ja",
          lines: [
            "@param x",
            "@type number",
            "@text X座標",
            "@default 0",
            "@param y",
            "@type number",
            "@text Y座標",
            "@default 0",
          ],
        },
        {
          struct: "Vector2",
          lines: [
            "@param x",
            "@type number",
            "@default 0",
            "@param y",
            "@type number",
            "@default 0",
          ],
        },
      ];
      const result = splitBlock(lines.join("\n"));
      expect(result.bodies).toEqual(expectedBodies);
      expect(result.structs).toEqual(expectedStructs);
    });
  });
  describe("noname struct", () => {
    it("is not allowed", () => {
      const lines: string[] = [
        "/*:",
        "@plugindesc mock",
        "*/",

        "/*~struct~:ja",
        "@param x",
        "@type number",
        "@default 0",
        "@param y",
        "@type number",
        "@default 0",
        "*/",
      ];

      const expectedBlcok: PluginBodyBlock = {
        lines: ["@plugindesc mock"],
      };

      const block: string = lines.join("\n");
      const result: Block = splitBlock(block);
      expect(result.structs).toEqual([]);
      expect(result.bodies).toEqual([expectedBlcok]);
    });
  });
});
