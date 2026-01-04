import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { FileParam, PluginParamEx } from "@RmmzPluginSchema/rmmz/plugin";
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
  test("file param", () => {
    const param: PluginParamEx<FileParam> = {
      name: "soundFile",
      attr: {
        kind: "file",
        default: "Bgm1",
        desc: "Select a sound file.",
        dir: "audio/bgm/",
      },
    };
    const expected: PluginParamAnnotation = {
      name: "@param soundFile",
      default: "@default Bgm1",
      attr: ["@dir audio/bgm/"],
      base: {
        kind: "@type file",
        desc: "@desc Select a sound file.",
        parent: undefined,
        text: undefined,
      },
    };
    const handlers = makeHandlers();
    const annotation = generatePluginParamAnnotation(param, "param", handlers);
    expect(annotation).toEqual(expected);
    expect(handlers.numberArray).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
    expect(handlers.struct).not.toHaveBeenCalled();
  });
});
