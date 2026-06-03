import { describe, expect, test, vi } from "vitest";
import type {
  AnyStringParam,
  PluginSchema,
  PrimitiveParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createTextParamDictionary } from "./createDictionary";
import type { TargetPath } from "./handlers";

type Plugin = Pick<PluginSchema, "schema" | "pluginName">;
const mockAnyParam: AnyStringParam = {
  kind: "any",
  default: "1,2,3",
};

describe("createTextParamDictionary", () => {
  describe("normal", () => {
    const schema: Plugin = {
      pluginName: "PluginA",
      schema: {
        commands: [
          {
            command: "TestCommand",
            args: [
              { name: "arg1", attr: { kind: "string", default: "" } },
              { name: "arg2", attr: { kind: "number", default: 0 } },
            ],
          },
        ],
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
        commands: [
          {
            commandName: "TestCommand",
            argsPath: [["arg1"]],
          },
        ],
      };
      const result = createTextParamDictionary(schema, anyFn);
      expect(result.commands).toEqual(expected.commands);
      expect(result.paramsPath).toEqual(expected.paramsPath);
      expect(anyFn).toHaveBeenCalledWith(mockAnyParam, "anyParam");
      expect(anyFn).toHaveBeenCalledTimes(1);
    });
  });
  describe("non text params", () => {
    const schema: Plugin = {
      pluginName: "PluginB",
      schema: {
        commands: [
          {
            command: "TestCommand",
            args: [
              { name: "arg1", attr: { kind: "number", default: 0 } },
              { name: "arg2", attr: { kind: "boolean", default: false } },
              {
                name: "arg3",
                attr: { kind: "file", default: "", dir: "pictures" },
              },
            ],
          },
        ],
        structs: [
          {
            struct: "vector2",
            params: [
              { name: "x", attr: { kind: "number", default: 0 } },
              { name: "y", attr: { kind: "number", default: 0 } },
            ],
          },
        ],
        params: [
          { name: "numberParam", attr: { kind: "number", default: 0 } },
          { name: "booleanParam", attr: { kind: "boolean", default: false } },
          {
            name: "fileParam",
            attr: { kind: "file", default: "", dir: "pictures" },
          },
          {
            name: "vectorParam",
            attr: {
              kind: "struct",
              struct: "vector2",
              default: { x: 0, y: 0 },
            },
          },
        ],
      },
    };
    test("returns empty paths when no string or any params are present", () => {
      const expected: TargetPath = {
        pluginName: "PluginB",
        paramsPath: [],
        commands: [],
      };
      const result = createTextParamDictionary(schema, () => {
        throw new Error("anyFn should not be called");
      });
      expect(result).toEqual(expected);
    });
    test("not called", () => {
      const anyFn = vi.fn(() => {
        throw new Error("anyFn should not be called");
      });
      createTextParamDictionary(schema, anyFn);
      expect(anyFn).not.toHaveBeenCalled();
    });
  });
  describe("any fn", () => {
    const schema: Plugin = {
      pluginName: "PluginAny",
      schema: {
        commands: [],
        structs: [],
        params: [
          { name: "anyParam1", attr: mockAnyParam },
          { name: "anyParam2", attr: mockAnyParam },
        ],
      },
    };
    test("filters any params based on the provided function", () => {
      const anyFn = vi.fn(
        (param: AnyStringParam, name: string) => name === "anyParam1",
      );
      const expected: TargetPath = {
        pluginName: "PluginAny",
        paramsPath: [["anyParam1"]],
        commands: [],
      };
      const result = createTextParamDictionary(schema, anyFn);
      expect(result).toEqual(expected);
      expect(anyFn).toHaveBeenCalledTimes(schema.schema.params.length);
      schema.schema.params.forEach((param) => {
        expect(anyFn).toHaveBeenCalledWith(param.attr, param.name);
      });
    });
    test("returns empty paramsPath if no any params pass the filter", () => {
      const anyFn = vi.fn(() => false);
      const expected: TargetPath = {
        pluginName: "PluginAny",
        paramsPath: [],
        commands: [],
      };
      const result = createTextParamDictionary(schema, anyFn);
      expect(result).toEqual(expected);
      expect(anyFn).toHaveBeenCalledTimes(schema.schema.params.length);
      schema.schema.params.forEach((param) => {
        expect(anyFn).toHaveBeenCalledWith(param.attr, param.name);
      });
    });
    test("returns all any params if all pass the filter", () => {
      const anyFn = vi.fn(() => true);
      const expected: TargetPath = {
        pluginName: "PluginAny",
        paramsPath: [["anyParam1"], ["anyParam2"]],
        commands: [],
      };
      const result = createTextParamDictionary(schema, anyFn);
      expect(result).toEqual(expected);
      expect(anyFn).toHaveBeenCalledTimes(schema.schema.params.length);
      schema.schema.params.forEach((param) => {
        expect(anyFn).toHaveBeenCalledWith(param.attr, param.name);
      });
    });
  });
  describe("any structs", () => {
    const schema: Plugin = {
      pluginName: "PluginStruct",
      schema: {
        commands: [],
        structs: [
          {
            struct: "AnyStruct",
            params: [
              { name: "field1", attr: mockAnyParam },
              { name: "field2", attr: mockAnyParam },
            ],
          },
        ],
        params: [
          {
            name: "structParam",
            attr: { kind: "struct", struct: "AnyStruct", default: {} },
          },
          {
            name: "anyParam",
            attr: mockAnyParam,
          },
        ],
      },
    };
    test("does not apply anyFn to struct fields", () => {
      const anyFn = vi.fn(() => true);
      const expected: TargetPath = {
        pluginName: "PluginStruct",
        paramsPath: [
          ["structParam", "field1"],
          ["structParam", "field2"],
          ["anyParam"],
        ],
        commands: [],
      };
      const result = createTextParamDictionary(schema, anyFn);
      expect(result).toEqual(expected);
      expect(anyFn).toHaveBeenCalledTimes(3);
      expect(anyFn).toHaveBeenCalledWith(mockAnyParam, "anyParam");
    });
    test("struct fields are included regardless of anyFn result", () => {
      const anyFn = vi.fn(() => false);
      const expected: TargetPath = {
        pluginName: "PluginStruct",
        paramsPath: [],
        commands: [],
      };
      const result = createTextParamDictionary(schema, anyFn);
      expect(result).toEqual(expected);
      expect(anyFn).toHaveBeenCalledTimes(3);
      expect(anyFn).toHaveBeenCalledWith(mockAnyParam, "anyParam");
    });
    test("struct fields are included regardless of anyFn result", () => {
      const anyFn = (attr: PrimitiveParam, name: string) => name === "field1";
      const expected: TargetPath = {
        pluginName: "PluginStruct",
        paramsPath: [["structParam", "field1"]],
        commands: [],
      };
      const result = createTextParamDictionary(schema, anyFn);
      expect(result).toEqual(expected);
    });
    test("struct fields are included regardless of anyFn result", () => {
      const anyFn = (attr: PrimitiveParam, name: string) => name !== "field1";
      const expected: TargetPath = {
        pluginName: "PluginStruct",
        paramsPath: [["structParam", "field2"], ["anyParam"]],
        commands: [],
      };
      const result = createTextParamDictionary(schema, anyFn);
      expect(result).toEqual(expected);
    });
  });
});
