import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compileAttributes } from "./attributes";
import type { DeepJSONParserHandlers } from "./deepJSONHandler";
import type { RpgDataIdParam, PrimitiveParam } from "./params";
import type { PluginParamTokens } from "./parse";

const createHandlers = (): MockedObject<DeepJSONParserHandlers> => ({
  parseStringArray: vi.fn(),
  parseObject: vi.fn(),
  parseObjectArray: vi.fn(),
});

describe("compileAttributes - dataId", () => {
  test("enemy", () => {
    const mock: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "enemy",
        default: "0",
      } satisfies ParamSoruceRecord<RpgDataIdParam>,
    };
    const expected: PrimitiveParam = {
      kind: "enemy",
      default: 0,
    };
    const handlers = createHandlers();
    const result = compileAttributes(mock, handlers);
    expect(result).toEqual(expected);
    expect(handlers.parseStringArray).not.toHaveBeenCalled();
    expect(handlers.parseObject).not.toHaveBeenCalled();
    expect(handlers.parseObjectArray).not.toHaveBeenCalled();
  });
});
