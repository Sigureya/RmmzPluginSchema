import { describe, expect, test, vi } from "vitest";
import type {
  AnyStringParam,
  PluginSchema,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createTextParamDictionary } from "./createDictionary";
import type { TargetPath } from "./handlers";

type Plugin = Pick<PluginSchema, "schema" | "pluginName">;
const mockAnyParam: AnyStringParam = {
  kind: "any",
  default: "1,2,3",
};

describe("createTextParamDictionary", () => {
  describe("createTextParamDictionary", () => {
    const schema: Plugin = {
      pluginName: "PluginA",
      schema: {
        commands: [],
        structs: [
          {
            struct: "Profile",
            params: [
              { name: "nickname", attr: { kind: "string", default: "" } },
              { name: "name", attr: { kind: "string", default: "" } },
              { name: "desc", attr: { kind: "string", default: "" } },
            ],
          },
        ],
        params: [
          { name: "title", attr: { kind: "string", default: "" } },
          { name: "names", attr: { kind: "string[]", default: [] } },
          { name: "anyParam", attr: mockAnyParam },
        ],
      },
    };
    test("collects only string and any params", () => {
      const anyFn = vi.fn((param: AnyStringParam) => param === mockAnyParam);
      const expected: TargetPath = {
        pluginName: "PluginA",
        paramsPath: [["title"], ["names"], ["names", "[]"], ["anyParam"]],
        commands: [],
      };
      const result = createTextParamDictionary(schema, anyFn);
      expect(result).toEqual(expected);
      expect(anyFn).toHaveBeenCalledWith(mockAnyParam, "anyParam");
      expect(anyFn).toHaveBeenCalledTimes(1);
    });
  });
});
