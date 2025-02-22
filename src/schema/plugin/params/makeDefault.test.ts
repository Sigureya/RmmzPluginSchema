import { test, expect, describe } from "vitest";
import type { NumberArg, Primitive_NumbersArray } from "./types/primitive";
import { makeDefault } from "./makeDefault";
import type { Struct, Type_Struct } from "./types";

const mockNumber: NumberArg = {
  default: 123,
  type: "number",
};

const mockNumberArray: Primitive_NumbersArray = {
  default: [1, 2, 3],
  type: "number[]",
};

describe("makeDefault", () => {
  test("number", () => {
    const result: number = makeDefault(mockNumber);
    expect(result).toBe(123);
  });
  test("numberArray", () => {
    const result: number[] = makeDefault(mockNumberArray);
    expect(result).toEqual([1, 2, 3]);
  });
});
interface Parson {
  name: string;
  age: number;
}
interface Home {
  name: string;
  address: {
    street: string;
    city: string;
  };
  family: Parson[];
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

const mockParson2: Type_Struct<Parson> = {
  default: { name: "aaa", age: 17 },
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

const mockHome: Type_Struct<Home> = {
  type: "struct",
  struct: {
    structName: "Home",
    params: {
      name: {
        type: "string",
        default: "Home",
      },
      address: {
        type: "struct",
        struct: {
          structName: "Address",
          params: {
            street: {
              type: "string",
              default: "sss",
            },
            city: {
              type: "string",
              default: "ccc",
            },
          },
        },
      },
      family: {
        type: "struct[]",
        struct: mockParson.struct,
        default: [],
      },
    },
  },
};
describe("makeDefault struct", () => {
  test("parson", () => {
    const parson: Parson = makeDefault(mockParson);
    expect(mockParson.default).toBeUndefined();
    const expected: Parson = { name: "John", age: 30 };
    expect(parson).toEqual(expected);
  });
  test("parson2", () => {
    const parson: Parson = makeDefault(mockParson2);
    const expected: Parson = { name: "aaa", age: 17 };
    expect(mockParson2.default).toEqual(expected);
    expect(parson).toEqual(expected);
  });

  test("home", () => {
    const home = makeDefault(mockHome);
    const expected: Home = {
      name: "Home",
      address: { street: "sss", city: "ccc" },
      family: [],
    };
    expect(home).toEqual(expected);
  });
});
