import { test, expect, describe } from "vitest";

import { maxDepth, flatStructs } from "./traverseStruct";
import type { NumberArg, Struct } from "./types";

interface Parson {
  name: string;
  age: number;
}

const mockParson: Struct<Parson> = {
  type: "struct",
  struct: {
    structName: "Parson",
    params: {
      name: {
        type: "string",
        default: "John",
      },
      age: {
        type: "number",
        default: 30,
      },
    },
  },
};

interface Home {
  name: string;
  address: string;
  family: Parson[];
}
const mockHome: Struct<Home> = {
  type: "struct",
  struct: {
    structName: "Home",
    params: {
      name: {
        type: "string",
        default: "Home",
      },
      address: {
        type: "string",
        default: "123",
      },
      family: {
        type: "struct[]",
        struct: mockParson.struct,
        default: [],
      },
    },
  },
};
const mockNumber: NumberArg = {
  default: 123,
  type: "number",
};
describe("maxDepth", () => {
  test("number", () => {
    const result: number = maxDepth(mockNumber);
    expect(result).toBe(0);
  });
  test("struct-parson", () => {
    const result: number = maxDepth(mockParson);
    expect(result).toBe(1);
  });
  test("struct-home", () => {
    const result: number = maxDepth(mockHome);
    expect(result).toBe(2);
  });
});

describe("flatStruct", () => {
  test("number", () => {
    const result = flatStructs(mockNumber);
    expect(result.size).toBe(0);
  });
  test("struct-parson", () => {
    const result = flatStructs(mockParson);
    expect(result.size).toBe(1);
    expect(result).toContain(mockParson.struct);
  });
  test("struct-home", () => {
    const result = flatStructs(mockHome);
    expect(result.size).toBe(2);
    expect(result).toContain(mockParson.struct);
    expect(result).toContain(mockHome.struct);
  });
});
