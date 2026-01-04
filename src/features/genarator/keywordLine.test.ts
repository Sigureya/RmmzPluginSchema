import { describe, expect, test } from "vitest";
import type {
  PrimitiveParam,
  StructArrayRefParam,
  StructRefParam,
} from "@RmmzPluginSchema/rmmz/plugin";
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
    const param: PrimitiveParam = {
      kind: "string",
      default: "",
    };
    const kindLine = createKindLine(param);
    expect(kindLine).toBe(expected);
  });
  test("creates correct kind line for struct", () => {
    const expected: KeyWord<"type"> = "@type struct<Person>";
    const param: StructRefParam = {
      kind: "struct",
      struct: "Person",
    };
    const kindLine = createKindLine(param);
    expect(kindLine).toBe(expected);
  });
  test("creates correct kind line for struct array", () => {
    const expected: KeyWord<"type"> = "@type struct<Person>[]";
    const param: StructArrayRefParam = {
      kind: "struct[]",
      struct: "Person",
    };
    const kindLine = createKindLine(param);
    expect(kindLine).toBe(expected);
  });
});
