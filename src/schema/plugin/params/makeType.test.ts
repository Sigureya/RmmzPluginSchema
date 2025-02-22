import { describe, test, expect } from "vitest";
import {
  baseAnnotion,
  numberArgAnnotations,
  selectAnnotations,
} from "./makeType";
import type { NumberArg, Primitive_NumbersArray } from "./types";

describe("number", () => {
  describe("single a", () => {
    const mockNumber: NumberArg = {
      default: 123,
      text: "test text",
      type: "number",
    };
    test("base", () => {
      const result = baseAnnotion(mockNumber);
      expect(result).toEqual(["@type number", "@text test text"]);
    });
    test("numberArg", () => {
      const result = numberArgAnnotations(mockNumber);
      expect(result).toEqual([]);
    });
  });
  describe("single b", () => {
    const mockNumber: NumberArg = {
      default: 123,
      type: "number",
      min: 1,
      max: 4,
      digit: 2,
    };
    test("base", () => {
      const result = baseAnnotion(mockNumber);
      expect(result).toEqual(["@type number"]);
    });
    test("numberArg", () => {
      const result = numberArgAnnotations(mockNumber);
      expect(result).toEqual(["@min 1", "@max 4", "@digit 2"]);
    });
  });

  describe("array", () => {
    const mockNumberArray: Primitive_NumbersArray = {
      default: [1, 2, 3],
      type: "number[]",
      min: 1,
      max: 4,
    };
    test("", () => {
      const result = baseAnnotion(mockNumberArray);
      expect(result).toEqual(["@type number[]"]);
    });
    test("", () => {
      const result = numberArgAnnotations(mockNumberArray);
      expect(result).toEqual(["@min 1", "@max 4"]);
    });
  });
});
describe("select", () => {
  const mockSelect = {
    type: "select",
    options: [
      { option: "a", value: 1 },
      { option: "b", value: 2 },
    ],
  };
  test("base", () => {
    const result = baseAnnotion(mockSelect);
    expect(result).toEqual(["@type select"]);
  });
  test("select", () => {
    const result = selectAnnotations(mockSelect);
    expect(result).toEqual(["@option a", "@value 1", "@option b", "@value 2"]);
  });
});
