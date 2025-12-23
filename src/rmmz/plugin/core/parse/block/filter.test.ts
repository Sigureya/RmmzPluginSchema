import { describe, expect, test } from "vitest";
import { filterSturctByLocale } from "./filter";
import type { PluginStructBlock } from "./types";

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
