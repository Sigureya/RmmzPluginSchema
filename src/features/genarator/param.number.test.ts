import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type {
  NumberArrayParam,
  NumberParam,
  PluginParamEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import { generatePluginParamAnnotation } from "./param";
import type { SchemaStringifyHandlers, PluginParamAnnotation } from "./types";

const makeHandlers = (): MockedObject<SchemaStringifyHandlers> => {
  return {
    numberArray: vi.fn<(n: number[]) => string>(() => "Mock numberArray"),
    structArray: vi.fn(),
    stringArray: vi.fn(),
    struct: vi.fn(),
  };
};

describe("genaratePluginParam", () => {
  test("number param", () => {
    const param: PluginParamEx<NumberParam> = {
      name: "numParam",
      attr: {
        kind: "number",
        text: "textKeyword",
        desc: "A numeric parameter.",
        parent: "parentKeyword",

        min: 10,
        max: 100,

        default: 42,
      },
    };
    const expected: PluginParamAnnotation = {
      name: "@param numParam",
      default: "@default 42",
      base: {
        kind: "@type number",
        desc: "@desc A numeric parameter.",
        parent: "@parent parentKeyword",
        text: "@text textKeyword",
      },
      attr: ["@min 10", "@max 100"],
    };
    const handlers = makeHandlers();
    const annotation = generatePluginParamAnnotation(param, "param", handlers);
    expect(annotation).toEqual(expected);
    expect(handlers.numberArray).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
    expect(handlers.struct).not.toHaveBeenCalled();
  });
  test("number array param", () => {
    const param: PluginParamEx<NumberArrayParam> = {
      name: "numArrayParam",
      attr: {
        kind: "number[]",
        desc: "An array of numbers.",

        default: [1, 2, 3],
        min: 0,
        max: 10,
      },
    };
    const expected: PluginParamAnnotation = {
      name: "@param numArrayParam",
      default: "@default Mock numberArray",
      base: {
        kind: "@type number[]",
        desc: "@desc An array of numbers.",
        parent: undefined,
        text: undefined,
      },
      attr: ["@min 0", "@max 10"],
    };
    const handlers = makeHandlers();
    const annotation = generatePluginParamAnnotation(param, "param", handlers);
    expect(annotation).toEqual(expected);
    expect(handlers.numberArray).toHaveBeenCalledWith([1, 2, 3]);
    expect(handlers.numberArray).toHaveBeenCalledTimes(1);
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
    expect(handlers.struct).not.toHaveBeenCalled();
  });
});
