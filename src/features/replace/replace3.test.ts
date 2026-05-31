import { describe, expect, test, vi } from "vitest";
import type { PluginParamsObject } from "@RmmzPluginSchema/rmmz/plugin";
import { replaceParamV4 } from "./replace3";

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
  input: PluginParamsObject;
  expected: PluginParamsObject;
  paths: string[][];
  oldValues: string[];
}

const runTestCase = (testCase: TestCase) => {
  describe(testCase.input.name, () => {
    test("replaceParamV4", () => {
      const result = replaceParamV4(testCase.input, testCase.paths, (value) => {
        return dic.get(value);
      });
      expect(result).toEqual(testCase.expected);
    });
    test("replaceParamV4", () => {
      const fn = vi.fn((value: string) => {
        return dic.get(value);
      });
      replaceParamV4(testCase.input, testCase.paths, fn);
      //      expect(fn).toHaveBeenCalledTimes(testCase.oldValues.length);
      testCase.oldValues.forEach((oldValue) => {
        expect(fn).toHaveBeenCalledWith(oldValue);
      });
    });
  });
};

const testCases: TestCase[] = [
  {
    input: {
      description: "Test case 1",
      name: "PluginA",
      status: true,
      parameters: {
        param1: "value1",
        param2: "value2",
      },
    },
    expected: {
      description: "Test case 1",
      name: "PluginA",
      status: true,
      parameters: {
        param1: "valueX",
        param2: "valueY",
      },
    },
    oldValues: ["value1", "value2"],
    paths: [["param1"], ["param2"]],
  },
  {
    input: {
      description: "Test case 2",
      name: "PluginB",
      status: false,
      parameters: {
        image: "abc",
        text: "abc",
      },
    },
    expected: {
      description: "Test case 2",
      name: "PluginB",
      status: false,
      parameters: {
        image: "abc",
        text: "ABC",
      },
    },
    oldValues: ["abc"],
    paths: [["text"]],
  },
  {
    oldValues: ["dragon"],
    paths: [["enemy", "name"]],
    input: {
      description: "Test case 2",
      name: "PluginD",
      status: false,
      parameters: {
        enemy: {
          name: "dragon",
          image: "dragon",
        },
      },
    },
    expected: {
      description: "Test case 2",
      name: "PluginD",
      status: false,
      parameters: {
        enemy: {
          name: "red dragon",
          image: "dragon",
        },
      },
    },
  },
  {
    oldValues: ["alpha", "beta", "gamma"],
    paths: [["names", "[]"]],
    input: {
      description: "Test case 3",
      name: "PluginE",
      status: true,
      parameters: {
        names: ["alpha", "beta", "gamma"],
      },
    },
    expected: {
      description: "Test case 3",
      name: "PluginE",
      status: true,
      parameters: {
        names: ["alice", "beta", "charlie"],
      },
    },
  },
  {
    oldValues: ["list-a", "list-b", "emerald", "garnet", "amethyst"],
    paths: [
      ["nameTables", "[]", "names", "[]"],
      ["nameTables", "[]", "listName"],
    ],
    input: {
      description: "Test case 4",
      name: "PluginF",
      status: true,
      parameters: {
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
    },
    expected: {
      description: "Test case 4",
      name: "PluginF",
      status: true,
      parameters: {
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
  },
];

testCases.forEach(runTestCase);
