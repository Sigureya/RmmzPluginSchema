import { test, expect, describe } from "vitest";
import type * as Types from "./types/";
import { makeDefault } from "./makeDefault";

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

const createMockParson = (): Types.Type_Struct<Parson> => ({
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
});

const mockParson2: Types.Type_Struct<Parson> = {
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

const createMockHome = (): Types.Type_Struct<Home> => ({
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
        struct: createMockParson().struct,
        default: [],
      },
    },
  },
});
describe("makeDefault", () => {
  describe("Struct Types", () => {
    test("parson", () => {
      const mockParson = createMockParson();
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
      const mockHome = createMockHome();
      const home = makeDefault(mockHome);
      const expected: Home = {
        name: "Home",
        address: { street: "sss", city: "ccc" },
        family: [],
      };
      expect(home).toEqual(expected);
    });
  });
  describe("Primitive types", () => {
    test("number", () => {
      const mockNumber: Types.NumberArg = {
        default: 123,
        type: "number",
      };
      const result: number = makeDefault(mockNumber);
      expect(result).toBe(123);
    });
    test("numberArray", () => {
      const mockNumberArray: Types.Primitive_NumbersArray = {
        default: [1, 2, 3],
        type: "number[]",
      };
      const result: number[] = makeDefault(mockNumberArray);
      expect(result).toEqual([1, 2, 3]);
    });
  });
});
