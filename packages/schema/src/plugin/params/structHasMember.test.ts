import { test, expect, describe } from "vitest";
import type {
  StructAnnotation_WithName,
  StructAnnotation_WithParams,
  StructAnnotation_WithDefault,
} from "./types";
import {
  hasStructDefault,
  hasStructName,
  hasStructParams,
} from "./structHasMember";

interface Parson {
  name: string;
  age: number;
}

const mockWithParam: StructAnnotation_WithParams<Parson> = {
  type: "struct",
  struct: {
    params: {
      name: {
        type: "string",
        default: "aaa",
      },

      age: {
        type: "number",
        default: 17,
      },
    },
  },
};

const mockWithName: StructAnnotation_WithName<Parson> = {
  type: "struct",
  struct: {
    structName: "Parson",
  },
};

const mockWithDefault: StructAnnotation_WithDefault<Parson> = {
  type: "struct",
  default: {
    name: "aaa",
    age: 17,
  },
};

describe("structHasMember", () => {
  test("hasStructParams", () => {
    expect(hasStructParams(mockWithParam)).toBe(true);
    expect(hasStructParams(mockWithName)).toBe(false);
    expect(hasStructParams(mockWithDefault)).toBe(false);
  });

  test("hasStructDefault", () => {
    expect(hasStructDefault(mockWithParam)).toBe(false);
    expect(hasStructDefault(mockWithName)).toBe(false);
    expect(hasStructDefault(mockWithDefault)).toBe(true);
  });

  test("hasStructName", () => {
    expect(hasStructName(mockWithParam)).toBe(false);
    expect(hasStructName(mockWithName)).toBe(true);
    expect(hasStructName(mockWithDefault)).toBe(false);
  });
});
