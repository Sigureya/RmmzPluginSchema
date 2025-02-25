import { test, expect, describe } from "vitest";
import type * as Types from "./types/";
import { makeDefaultStruct, makeDefaultValue } from "./makeDefault";

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

const createMockParson = (default_?: Parson): Types.Type_Struct<Parson> => ({
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
  default: default_,
});

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
const mockDictionary: Types.Dictionary = {
  cat: "CAT",
  John: "JOHN",
};

describe("makeDefaultStruct", () => {
  test("parson", () => {
    const mockParson = createMockParson();
    const parson: Parson = makeDefaultStruct(mockParson);
    expect(mockParson.default).toBeUndefined();
    const expected: Parson = { name: "John", age: 30 };
    expect(parson).toEqual(expected);
    const json = makeDefaultValue(mockParson);
    expect(json).toBe('{"name":"John","age":30}');
  });
  test("parson manualy defaultValue", () => {
    const mock = createMockParson({
      name: "aaa",
      age: 17,
    });
    const parson: Parson = makeDefaultStruct(mock);
    const expected: Parson = { name: "aaa", age: 17 };
    expect(mock.default).toEqual(expected);
    expect(parson).toEqual(expected);
  });

  test("home", () => {
    const mockHome = createMockHome();
    const home = makeDefaultStruct(mockHome);
    const expected: Home = {
      name: "Home",
      address: { street: "sss", city: "ccc" },
      family: [],
    };
    expect(home).toEqual(expected);
  });
});
const xxxx = <Text extends string>(
  caseName: string,
  ant: Types.AnnotationTypes,
  exceededText: Text,
  dictionary: Record<Text, string>
) => {
  test(caseName, () => {
    expect(makeDefaultValue(ant)).toBe(exceededText);
  });
  test(`${caseName} with custom dictionary`, () => {
    expect(makeDefaultValue(ant, dictionary)).toBe(exceededText);
  });
  test(`${caseName} with dictionary`, () => {
    expect(makeDefaultValue(ant, mockDictionary)).toBe(exceededText);
  });
};
describe("makeDefaultValue Primitive types ", () => {
  describe("boolean", () => {
    const mockBoolean: Types.BooleanArg = {
      default: true,
      type: "boolean",
    };
    xxxx("boolean", mockBoolean, "true", { true: "false" });
  });
  describe("boolean2", () => {
    const mockBoolean: Types.BooleanArg = {
      default: false,
      type: "boolean",
      on: "on",
      off: "off",
    };
    xxxx("boolean2", mockBoolean, "false", { false: "true" });
  });
  describe("number", () => {
    const mockNumber: Types.NumberArg = {
      default: 123,
      type: "number",
    };
    xxxx("number", mockNumber, "123", { "123": "999" });
  });
  describe("numberArray", () => {
    const mockNumberArray: Types.Primitive_NumbersArray = {
      default: [1, 2, 3],
      type: "number[]",
    };
    xxxx("numberArray", mockNumberArray, "[1,2,3]", { "[1,2,3]": "[9,8,7]" });
  });
  describe("string", () => {
    const mockString: Types.Primitive_Strings = {
      default: "cat",
      type: "string",
    };
    test("no dictionary", () => {
      const result: string = makeDefaultValue(mockString);
      expect(result).toBe("cat");
    });
    test("with dictionary", () => {
      const result: string = makeDefaultValue(mockString, mockDictionary);
      expect(result).toBe("CAT");
    });
  });
  test("stringArray", () => {
    const mockStringArray: Types.Primitive_StringsArray = {
      default: ["a", "b", "c"],
      type: "string[]",
    };
    const json = makeDefaultValue(mockStringArray);
    expect(json).toBe('["a","b","c"]');
  });
});

describe("makeDefault with Dictionary", () => {
  const dic: Types.Dictionary = {
    on: "enabled",
    off: "disabled",
  };
  describe("string", () => {
    test("string", () => {
      const mockString: Types.Primitive_Strings = {
        default: "test",
        type: "string",
      };
      const result: string = makeDefaultValue(mockString, dic);
      expect(result).toBe("test");
    });
  });
});
