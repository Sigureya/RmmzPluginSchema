import { describe, expect, test } from "vitest";
import {
  createKeywordLine,
  createKeywordLineEx,
  createKindLine,
} from "./keywordLine";
import type { KeyWord } from "./types";

describe("createKeywordLine", () => {
  test("creates correct keyword line", () => {
    const expected: KeyWord<"param"> = "@param value";
    const keywordLine = createKeywordLine("param", "value");
    expect(keywordLine).toBe(expected);
  });
  test("creates correct keyword line with different keyword", () => {
    const expected: KeyWord<"type"> = "@type string";
    const keywordLine = createKeywordLine("type", "string");
    expect(keywordLine).toBe(expected);
  });
});

describe("createKeywordLineEx", () => {
  test("creates correct keyword line from object", () => {
    const data = { param: "value" };
    const expected: KeyWord<"param"> = "@param value";
    const keywordLine = createKeywordLineEx(data, "param");
    expect(keywordLine).toBe(expected);
  });
  test("returns undefined for missing property", () => {
    const data = { param: undefined };
    const keywordLine = createKeywordLineEx(data, "param");
    expect(keywordLine).toBeUndefined();
  });
});

describe("createKindLine", () => {
  test("creates correct kind line", () => {
    const expected: KeyWord<"type"> = "@type string";
    const kindLine = createKindLine({ kind: "string" });
    expect(kindLine).toBe(expected);
  });
});
