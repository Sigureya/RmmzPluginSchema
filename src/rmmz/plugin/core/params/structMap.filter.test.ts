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
      // expect(result.sttuctName).toEqual(new Set(testCase.expected.names));
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
    ],
    expected: {
      structs: [
        {
          struct: "s3",
          params: [
            { name: "s1", attr: { kind: "struct", struct: "s1" } },
            { name: "s2List", attr: { kind: "struct[]", struct: "s2" } },
          ],
        },
      ],
    },
    fn: (p) => p.kind !== "string" && p.kind !== "string[]",
  },
];

testCases.forEach(runTestCase);
