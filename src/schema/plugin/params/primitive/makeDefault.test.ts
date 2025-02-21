import { test, expect, describe } from "vitest";
import type { NumberArg } from "./types";
import { baseAnnotion, makeDefaultPrimitive } from "./makeDefault";

const xxxx = <T>(
  ant: T,
  key: ReadonlyArray<string & keyof T>,
  expected: string[]
) => {};

describe("number", () => {
  const mockNumber: NumberArg = {
    default: 123,
    type: "number",
  };
  test("default", () => {
    const result: string = makeDefaultPrimitive(mockNumber);
    expect(result).toBe("@default 123");
  });
  test("base", () => {
    const result = baseAnnotion(mockNumber);
    expect(result).toEqual(["@type number"]);
  });
});
