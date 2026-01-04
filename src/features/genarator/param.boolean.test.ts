import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type {
  BooleanParam,
  PluginParamEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import { generatePluginParamAnnotation } from "./param";
import type { PluginParamAnnotation } from "./types/schema";
import type { SchemaStringifyHandlers } from "./types/stringlfy";

const makeHandlers = (): MockedObject<SchemaStringifyHandlers> => {
  return {
    numberArray: vi.fn(),
    structArray: vi.fn(),
    stringArray: vi.fn(),
    struct: vi.fn(),
  };
};

describe("genaratePluginParam", () => {
  test("boolean true default", () => {
    const param: PluginParamEx<BooleanParam> = {
      name: "isEnabled",
      attr: {
        kind: "boolean",
        desc: "Enable or disable the feature.",
        on: "Yes",
        off: "No",
        default: true,
      },
    };

    const expected: PluginParamAnnotation = {
      name: "@param isEnabled",
      default: "@default true",
      base: {
        kind: "@type boolean",
        parent: undefined,
        text: undefined,
        desc: "@desc Enable or disable the feature.",
      },
      attr: ["@on Yes", "@off No"],
    };
    const handlers = makeHandlers();
    const annotation = generatePluginParamAnnotation(param, "param", handlers);
    expect(annotation).toEqual(expected);
    expect(handlers.numberArray).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
    expect(handlers.struct).not.toHaveBeenCalled();
  });
  test("boolean false default", () => {
    const param: PluginParamEx<BooleanParam> = {
      name: "keyMemory",
      attr: {
        kind: "boolean",
        desc: "when key is released, restore previous state.",
        text: "Enable memory",
        on: "enable",
        off: "disable",
        default: false,
      },
    };
    const expected: PluginParamAnnotation = {
      name: "@arg keyMemory",
      default: "@default false",
      base: {
        parent: undefined,
        kind: "@type boolean",
        desc: "@desc when key is released, restore previous state.",
        text: "@text Enable memory",
      },
      attr: ["@on enable", "@off disable"],
    };
    const handlers = makeHandlers();
    const annotation = generatePluginParamAnnotation(param, "arg", handlers);
    expect(annotation).toEqual(expected);
    expect(handlers.numberArray).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
    expect(handlers.struct).not.toHaveBeenCalled();
  });
});
