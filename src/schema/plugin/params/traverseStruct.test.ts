import { test, expect, describe } from "vitest";

import { maxDepth } from "./traverseStruct";
import type { NumberArg } from "./primitive";
import type { Type_Struct } from "./structBase";

interface Parson {
  name: string;
  age: number;
}

const mockParson: Type_Struct<Parson> = {
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
  default: {
    name: "John",
    age: 30,
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
  test("struct", () => {
    const result: number = maxDepth(mockParson);
    expect(result).toBe(1);
  });
});
