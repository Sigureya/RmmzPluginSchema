import { describe, test, expect } from "vitest";
import { localizeBlocks } from "./localize";
import type {
  LocalizedBlock,
  PluginBodyBlock,
  PluginStructBlock,
} from "./types";

describe("localizeBlocks", () => {
  const bodyJA: PluginBodyBlock = {
    locale: "ja",
    lines: ["@plugindesc モック"],
  };
  const structJA: PluginStructBlock = {
    locale: "ja",
    struct: "Vector2",
    lines: [
      "@param x",
      "@type number",
      "@default 0",
      "@param y",
      "@type number",
      "@default 0",
    ],
  };
  const body: PluginBodyBlock = {
    lines: ["@plugindesc mock"],
  };
  const struct: PluginStructBlock = {
    struct: "Vector2",
    lines: [
      "@param x",
      "@type number",
      "@default 0",
      "@param y",
      "@type number",
      "@default 0",
    ],
  };

  test("should return localized blocks", () => {
    const expected: LocalizedBlock[] = [
      {
        body: body,
        structs: [struct],
      },
    ];
    const result = localizeBlocks([body], [struct]);
    expect(result).toEqual(expected);
  });
  test("should return localized blocks with locale", () => {
    const expected: LocalizedBlock[] = [
      {
        body: bodyJA,
        structs: [structJA],
      },
    ];
    const result = localizeBlocks([bodyJA], [structJA]);
    expect(result).toEqual(expected);
  });
  test("should return localized blocks with mixed locale", () => {
    const expected: LocalizedBlock[] = [
      {
        body: bodyJA,
        structs: [structJA],
      },
      {
        body: body,
        structs: [struct],
      },
    ];
    const result = localizeBlocks([bodyJA, body], [structJA, struct]);
    expect(result).toEqual(expected);
  });
  test("should return localized blocks with mixed locale", () => {
    const expected: LocalizedBlock[] = [
      {
        body: bodyJA,
        structs: [structJA],
      },
      {
        body: body,
        structs: [struct],
      },
    ];
    const result = localizeBlocks([bodyJA, body], [struct, structJA]);
    expect(result).toEqual(expected);
  });
});
