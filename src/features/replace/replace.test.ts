import { describe, expect, test, vi } from "vitest";
import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import { ppxx } from "./replace";

const dic = new Map<string, string>([
  ["abc", "ABC"],
  ["value1", "valueX"],
  ["value2", "valueY"],
  ["dragon", "red dragon"],
  ["listName", "list-red"],
  ["list-a", "list-x"],
  ["garnet", "ruby"],
  ["amethyst", "sapphire"],
  ["emerald", "emerald"],
  ["gamma", "charlie"],
  ["alpha", "alice"],
]);

interface TestCase {
  name: string;
  input: Record<string, JSONValue>;
  expected: Record<string, JSONValue>;
  paths: string[][];
  oldValues: string[];
}

const runTestCase = (testCase: TestCase) => {
  describe(testCase.name, () => {
    test("replaceParamV4", () => {
      const result = ppxx(testCase.input, testCase.paths, (value) => {
        return dic.get(value);
      });
      expect(result).toEqual(testCase.expected);
    });
    test("replaceParamV4", () => {
      const fn = vi.fn((value: string) => {
        return dic.get(value);
      });
      ppxx(testCase.input, testCase.paths, fn);
      testCase.oldValues.forEach((oldValue) => {
        expect(fn).toHaveBeenCalledWith(oldValue);
      });
    });
  });
};

const testCases: TestCase[] = [
  {
    name: "Test case 1",
    input: {
      param1: "value1",
      param2: "value2",
    },
    expected: {
      param1: "valueX",
      param2: "valueY",
    },
    oldValues: ["value1", "value2"],
    paths: [["param1"], ["param2"]],
  },
  {
    name: "Test case 2",
    input: {
      image: "abc",
      text: "abc",
    },
    expected: {
      image: "abc",
      text: "ABC",
    },
    oldValues: ["abc"],
    paths: [["text"]],
  },
  {
    name: "Test case 3",
    oldValues: ["dragon"],
    paths: [["enemy", "name"]],
    input: {
      enemy: {
        name: "dragon",
        image: "dragon",
      },
    },
    expected: {
      enemy: {
        name: "red dragon",
        image: "dragon",
      },
    },
  },
  {
    name: "Test case 4",
    oldValues: ["alpha", "beta", "gamma"],
    paths: [["names", "[]"]],
    input: {
      names: ["alpha", "beta", "gamma"],
    },
    expected: {
      names: ["alice", "beta", "charlie"],
    },
  },
  {
    name: "Test case 5",
    oldValues: ["list-a", "list-b", "emerald", "garnet", "amethyst"],
    paths: [
      ["nameTables", "[]", "names", "[]"],
      ["nameTables", "[]", "listName"],
    ],
    input: {
      nameTables: [
        {
          listName: "list-a",
          variableId: 1,
          names: ["emerald", "garnet"],
        },
        {
          listName: "list-b",
          variableId: 2,
          names: ["amethyst"],
        },
      ],
    },
    expected: {
      nameTables: [
        {
          listName: "list-x",
          variableId: 1,
          names: ["emerald", "ruby"],
        },
        {
          listName: "list-b",
          variableId: 2,
          names: ["sapphire"],
        },
      ],
    },
  },
];

testCases.forEach(runTestCase);
