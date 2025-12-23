import { describe, expect, test } from "vitest";
import { filterSturctByLocale, findPluginBodyAnnotation } from "./filter";
import type { PluginBodyBlock, PluginStructBlock } from "./types";

describe("findPluginBodyAnnotation", () => {
  const bodyEn: PluginBodyBlock = {
    locale: undefined,
    lines: ["@param name", "@type string", "@default John"],
  };

  const bodyJa: PluginBodyBlock = {
    locale: "ja",
    lines: ["@param name", "@type string", "@default ジョン"],
  };

  const bodyFr: PluginBodyBlock = {
    locale: "fr",
    lines: ["@param name", "@type string", "@default Jean"],
  };

  const input: PluginBodyBlock[] = [bodyJa, bodyEn, bodyFr];
  test("en", () => {
    const result = findPluginBodyAnnotation(input, "en");
    expect(result).toBe(bodyEn);
  });
  test("ja", () => {
    const result = findPluginBodyAnnotation(input, "ja");
    expect(result).toBe(bodyJa);
  });
  test("fr", () => {
    const result = findPluginBodyAnnotation(input, "fr");
    expect(result).toBe(bodyFr);
  });
  test("unknown", () => {
    const result = findPluginBodyAnnotation(input, "unknown");
    expect(result).toBe(bodyEn);
  });
});

describe("filterBlock", () => {
  const input: PluginStructBlock[] = [
    {
      struct: "Vector2",
      locale: "ja",
      lines: ["@param id", "@type number", "@default 0"],
    },
    {
      struct: "Vector2",
      locale: undefined,
      lines: ["@param id", "@type number", "@default 0"],
    },
    {
      struct: "Person",
      locale: undefined,
      lines: ["@param name", "@type string", "@default John"],
    },
  ];
  test("ja", () => {
    const expected: PluginStructBlock[] = [
      {
        struct: "Vector2",
        locale: "ja",
        lines: ["@param id", "@type number", "@default 0"],
      },
      {
        struct: "Person",
        locale: undefined,
        lines: ["@param name", "@type string", "@default John"],
      },
    ];
    const result = filterSturctByLocale(input, "ja");
    expect(result).toEqual(expected);
  });
  test("en", () => {
    const expected: PluginStructBlock[] = [
      {
        struct: "Vector2",
        locale: undefined,
        lines: ["@param id", "@type number", "@default 0"],
      },
      {
        struct: "Person",
        locale: undefined,
        lines: ["@param name", "@type string", "@default John"],
      },
    ];
    const result = filterSturctByLocale(input, "en");
    expect(result).toEqual(expected);
  });
});
