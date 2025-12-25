import { describe, test, expect } from "vitest";
import { omitPluginParam } from "./ignore";
import type { PluginParamIgnore, PluginParamsRecord } from "./types";

const mockPluginA: PluginParamsRecord = {
  name: "PluginA",
  status: true,
  description: "A test plugin",
  parameters: {
    param1: "value1",
    param2: "value2",
    param3: "value3",
  },
};

const mockPluginB: PluginParamsRecord = {
  name: "PluginB",
  status: false,
  description: "Another test plugin",
  parameters: {
    alpha: JSON.stringify({
      age: "25",
      name: "Alice",
    }),
    beta: "simpleValue",
  },
};

const mockIgnoreList: PluginParamIgnore[] = [
  {
    pluginName: "PluginA",
    params: ["param2"],
  },
  {
    pluginName: "PluginB",
    params: ["alpha"],
  },
];

describe("omitPluginParam", () => {
  test("omits specified parameters from plugins", () => {
    const expected: PluginParamsRecord[] = [
      {
        name: "PluginA",
        status: true,
        description: "A test plugin",
        parameters: {
          param1: "value1",
          param3: "value3",
        },
      },
      {
        name: "PluginB",
        status: false,
        description: "Another test plugin",
        parameters: {
          beta: "simpleValue",
        },
      },
    ];
    const result = omitPluginParam([mockPluginA, mockPluginB], mockIgnoreList);
    expect(result).toEqual(expected);
  });
});
