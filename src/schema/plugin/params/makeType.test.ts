import { describe, test, expect } from "vitest";
import { makeDefaultPrimitive, baseAnnotion } from "./makeType";
import type { NumberArg, Primitive_NumbersArray } from "./types";
const mockNumber: NumberArg = {
  default: 123,
  type: "number",
};

const mockNumberArray: Primitive_NumbersArray = {
  default: [1, 2, 3],
  type: "number[]",
};
describe("number", () => {
  test("default", () => {
    const result: string = makeDefaultPrimitive(mockNumber);
    expect(result).toBe("@default 123");
  });
  test("base", () => {
    const result = baseAnnotion(mockNumber);
    expect(result).toEqual(["@type number"]);
  });
});
