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
};

interface Home {
  name: string;
  address: string;
  family: Parson[];
}
const mockHome: Omit<Type_Struct<Home>, "default"> = {
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
  test("struct", () => {
    const result: number = maxDepth(mockParson);
    expect(result).toBe(1);
  });
});
