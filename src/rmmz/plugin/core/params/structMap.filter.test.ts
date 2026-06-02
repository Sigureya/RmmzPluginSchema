import { describe, expect, test, vi } from "vitest";
import { filterStructParamsByFn } from "./structMap";
import type { PluginStructSchemaArray, PrimitiveParam } from "./types";

interface TestCase {
  caseName: string;
  schema: PluginStructSchemaArray[];
  expected: {
    // names: string[];
    structs: PluginStructSchemaArray[];
  };
  fn: (param: PrimitiveParam, name: string) => boolean;
}

const numParams = (schema: ReadonlyArray<PluginStructSchemaArray>): number => {
  return schema.map((s) => s.params.length).reduce((a, b) => a + b, 0);
};

const runTestCase = (testCase: TestCase) => {
  describe(testCase.caseName, () => {
    test(testCase.caseName, () => {
      const fn = vi.fn(testCase.fn);
      filterStructParamsByFn(testCase.schema, fn);
      expect(fn).toHaveBeenCalledTimes(numParams(testCase.schema));
      testCase.schema.forEach((s) => {
        s.params.forEach((p) => {
          expect(fn).toHaveBeenCalledWith(p.attr, p.name);
        });
      });
    });
    test("returns expected struct names and structs", () => {
      const result = filterStructParamsByFn(testCase.schema, testCase.fn);
      expect(result.structs).toEqual(testCase.expected.structs);
    });
  });
};

const testCases: TestCase[] = [
  {
    caseName: "empty",
    schema: [],
    expected: {
      structs: [],
    },
    fn: () => {
      throw new Error("should not be called");
    },
  },
  {
    caseName: "all number",
    schema: [
      {
        struct: "Vector2",
        params: [
          { name: "x", attr: { kind: "number", default: 0 } },
          { name: "y", attr: { kind: "number", default: 0 } },
        ],
      },
    ],
    expected: {
      structs: [
        {
          struct: "Vector2",
          params: [
            { name: "x", attr: { kind: "number", default: 0 } },
            { name: "y", attr: { kind: "number", default: 0 } },
          ],
        },
      ],
    },
    fn: (p) => p.kind === "number",
  },
  {
    caseName: "mixed",
    fn: (p) => p.kind === "string",
    schema: [
      {
        struct: "Person",
        params: [
          { name: "name", attr: { kind: "string", default: "" } },
          { name: "age", attr: { kind: "number", default: 0 } },
        ],
      },
    ],
    expected: {
      structs: [
        {
          struct: "Person",
          params: [{ name: "name", attr: { kind: "string", default: "" } }],
        },
      ],
    },
  },
  {
    caseName: "all string",
    schema: [
      {
        struct: "s1",
        params: [{ name: "str", attr: { kind: "string", default: "" } }],
      },
      {
        struct: "s2",
        params: [{ name: "strList", attr: { kind: "string[]", default: [] } }],
      },
      {
        struct: "s3",
        params: [
          { name: "s1", attr: { kind: "struct", struct: "s1" } },
          { name: "s2List", attr: { kind: "struct[]", struct: "s2" } },
        ],
      },
    ],
    expected: {
      structs: [],
    },
    fn: (p) => p.kind !== "string" && p.kind !== "string[]",
  },

  {
    caseName: "sss",
    schema: [
      {
        struct: "s1",
        params: [{ name: "str", attr: { kind: "string", default: "" } }],
      },
      {
        struct: "s2",
        params: [{ name: "strList", attr: { kind: "string[]", default: [] } }],
      },
      {
        struct: "s3",
        params: [
          { name: "s1", attr: { kind: "struct", struct: "s1" } },
          { name: "s2List", attr: { kind: "struct[]", struct: "s2" } },
        ],
      },
      {
        struct: "s4",
        params: [{ name: "s3", attr: { kind: "struct", struct: "s3" } }],
      },
      {
        struct: "s5",
        params: [{ name: "s4List", attr: { kind: "struct[]", struct: "s4" } }],
      },
    ],
    expected: {
      structs: [],
    },
    fn: (p) => p.kind !== "string" && p.kind !== "string[]",
  },
];

testCases.forEach(runTestCase);
