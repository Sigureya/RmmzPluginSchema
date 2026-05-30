import { describe, test, expect } from "vitest";
import { structName, typeIsStruct, typeIsStructArray } from "./struct";

describe("structName", () => {
  test("should extract struct name from valid struct type", () => {
    const result = structName("struct<Person>");
    expect(result).toBe("Person");
  });

  test("should return empty string for invalid struct type", () => {
    const result = structName("structPerson");
    expect(result).toBe("");
  });

  test("should return empty string for non-struct type", () => {
    const result = structName("number");
    expect(result).toBe("");
  });

  test("should handle empty input", () => {
    const result = structName("");
    expect(result).toBe("");
  });

  test("should return empty string for struct array type", () => {
    const result = structName("struct<Person>[]");
    expect(result).toBe("");
  });
});

describe("typeIsStruct", () => {
  test("returns true for struct type", () => {
    expect(typeIsStruct("struct<Person>")).toBe(true);
  });

  test("returns false for struct array type", () => {
    expect(typeIsStruct("struct<Person>[]")).toBe(false);
  });

  test("returns false for primitive type", () => {
    expect(typeIsStruct("number")).toBe(false);
  });
});

describe("typeIsStructArray", () => {
  test("returns true for struct array type", () => {
    expect(typeIsStructArray("struct<Person>[]")).toBe(true);
  });

  test("returns false for struct type", () => {
    expect(typeIsStructArray("struct<Person>")).toBe(false);
  });

  test("returns false for primitive array type", () => {
    expect(typeIsStructArray("string[]")).toBe(false);
  });
});
