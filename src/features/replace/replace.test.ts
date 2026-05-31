import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { PluginParamsObject } from "@RmmzPluginSchema/rmmz/plugin";
import type { ReplaceHandler } from "./handlers";
import { replaceXXX } from "./replace";

interface TestCase {
  input: PluginParamsObject;
  expected: PluginParamsObject;
}

const map = new Map<string, string>([
  ["pluginD:enemy.name", "red dragon"],
  ["pluginB:text", "xyz"],
  ["pluginA:param1", "valueX"],
  ["pluginA:param2", "valueY"],
  ["pluginE:names[0]", "alice"],
  ["pluginE:names[2]", "charlie"],
  ["pluginF:nameTables[0].listName", "list-red"],
  ["pluginF:nameTables[0].names[1]", "ruby"],
  ["pluginF:nameTables[1].names[0]", "sapphire"],
]);

const createMockReplaceHandler = (): MockedObject<ReplaceHandler> => {
  return {
    findNewText: vi.fn((path: string, oldValue) => {
      return map.get(path);
    }),
    tansaStop: vi.fn((path: string) => {
      return false;
    }),
  };
};

const runTestCase = (testCase: TestCase) => {
  describe(testCase.input.name, () => {
    test("replaceXXX", () => {
      const mockHandler = createMockReplaceHandler();
      const result = replaceXXX(testCase.input, mockHandler);
      expect(result).toEqual(testCase.expected);
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
        text: "xyz",
      },
    },
  },
  {
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
            listName: "list-red",
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
