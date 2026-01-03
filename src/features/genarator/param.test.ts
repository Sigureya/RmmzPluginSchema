import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type {
  AnyStringParam,
  BooleanParam,
  ComboParam,
  FileArrayParam,
  FileParam,
  NumberArrayParam,
  NumberParam,
  ParamBase,
  PluginArrayParamType,
  PluginParam,
  PluginParamEx,
  PrimitiveParam,
  RpgDataIdArrayParam,
  RpgDataIdParam,
  SelectParam,
  StringArrayParam,
  StringParam,
  StructArrayRefParam,
  StructRefParam,
  SystemDataIdArrayParam,
  SystemDataIdParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { genaratePluginParam } from "./param";
import type { PluginParamAnnotation } from "./types/schema";
import type { StringifyXX } from "./types/stringlfy";

interface TestCase<T extends PrimitiveParam> {
  schema: PluginParamEx<T>;
  annotation: PluginParamAnnotation;
  mockResult: string;
}
type AllParamTypes = {
  [K in PrimitiveParam["kind"]]?: TestCase<PrimitiveParam & { kind: K }>;
};

const PARAM_TABLE = {
  boolean: {
    schema: {
      name: "isEnabled",
      attr: {
        kind: "boolean",
        desc: "Enable or disable the feature.",
        on: "Yes",
        off: "No",
        default: true,
      },
    },
    annotation: {
      name: "@param isEnabled",
      attr: ["@type boolean", "@desc Enable or disable the feature."],
      base: {
        kind: "@type boolean",
        desc: "@desc Enable or disable the feature.",
        text: undefined,
        parent: undefined,
      },
      default: "@default true",
    },
    mockResult: "true",
  },

  "actor[]": {
    schema: {
      name: "actorArray",
      attr: {
        kind: "actor[]",
        parent: "ppp",
        desc: "An array of actor IDs.",
        text: "Select multiple actors.",
        default: [3],
      },
    },
    annotation: {
      name: "@param actorArray",
      attr: [],
      base: {
        kind: "@type actor[]",
        desc: "@desc An array of actor IDs.",
        text: "@text Select multiple actors.",
        parent: "@parent ppp",
      },
      default: "@default [3]",
    },
    mockResult: "[3]",
  },
  actor: {
    schema: {
      name: "actorId",
      attr: {
        kind: "actor",
        parent: "xxx",
        desc: "An actor ID.",
        default: 1,
      },
    },
    mockResult: "1",
    annotation: {
      name: "@param actorId",
      attr: [],
      default: "@default 1",
      base: {
        kind: "@type actor",
        desc: "@desc An actor ID.",
        parent: "@parent xxx",
      },
    },
  },
  file: {
    schema: {
      name: "fileParam",
      attr: {
        kind: "file",
        default: "Picture",
        dir: "img/pictures/",
      },
    },
    mockResult: "Picture",
    annotation: {
      name: "@param fileParam",
      default: "@default Picture",
      attr: ["@dir img/pictures/"],
      base: {
        kind: "@type file",
      },
    },
  },
  "file[]": {
    schema: {
      name: "soudFileArray",
      attr: {
        kind: "file[]",
        default: ["Bgm1", "Bgm2"],
        dir: "audio/bgm/",
      },
    },
    mockResult: '["Bgm1","Bgm2"]',
    annotation: {
      name: "@param soudFileArray",
      default: `@default ["Bgm1","Bgm2"]`,
      attr: ["@dir audio/bgm/"],
      base: { kind: "@type file[]" },
    },
  },
} satisfies AllParamTypes;

const makeHandlers = (result: string): MockedObject<StringifyXX> => {
  return {
    numberArray: vi.fn<(nums: number[]) => string>(() => result),
    structArray: vi.fn<(obj: object[]) => string>(() => result),
    stringArray: vi.fn<(s: string[]) => string>(() => result),
    struct: vi.fn<(obj: object) => string>(() => result),
  };
};

describe("genaratePluginParam", () => {
  test("boolean param", () => {});

  test("actor param", () => {
    const paramInfo: TestCase<RpgDataIdParam> = PARAM_TABLE["actor"];
    const handlers = makeHandlers("1");
    const annotation = genaratePluginParam(paramInfo.schema, "param", handlers);
    expect(annotation).toEqual(paramInfo.annotation);
    expect(handlers.struct).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.numberArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
  });
  test("actor array param", () => {
    const paramInfo: TestCase<RpgDataIdArrayParam> = PARAM_TABLE["actor[]"];
    const handlers = makeHandlers("[3]");
    const annotation = genaratePluginParam(paramInfo.schema, "param", handlers);
    expect(annotation).toEqual(paramInfo.annotation);
    expect(handlers.numberArray).toHaveBeenCalledWith(
      paramInfo.schema.attr.default
    );
    expect(handlers.numberArray).toHaveBeenCalledTimes(1);
    expect(handlers.struct).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
  });
  test("file param", () => {
    const paramInfo: TestCase<FileParam> = PARAM_TABLE["file"];
    const handlers = makeHandlers("Picture");
    const annotation = genaratePluginParam(paramInfo.schema, "param", handlers);
    expect(annotation).toEqual(paramInfo.annotation);
    expect(handlers.struct).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.numberArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
  });
  test("file array param", () => {
    const paramInfo: TestCase<FileArrayParam> = PARAM_TABLE["file[]"];
    const handlers = makeHandlers('["Bgm1","Bgm2"]');
    const annotation = genaratePluginParam(paramInfo.schema, "param", handlers);
    expect(annotation).toEqual(paramInfo.annotation);
    expect(handlers.stringArray).toHaveBeenCalledWith(
      paramInfo.schema.attr.default
    );
    expect(handlers.stringArray).toHaveBeenCalledTimes(1);
    expect(handlers.struct).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.numberArray).not.toHaveBeenCalled();
  });
});
