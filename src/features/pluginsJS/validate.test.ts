import { describe, test, expect } from "vitest";
import type { PluginParamsObject } from "./types";
import { validatePluginJS } from "./validate";

describe("validatePluginJS", () => {
  test("returns true for valid PluginParamsObject", () => {
    const validObj: PluginParamsObject = {
      name: "TestPlugin",
      status: true,
      description: "A test plugin",
      parameters: {
        param1: "value1",
        param2: "value2",
      },
    };
    expect(validatePluginJS(validObj)).toBe(true);
  });

  test("returns false if data is an array", () => {
    expect(validatePluginJS([])).toBe(false);
  });

  test("returns false if data is null", () => {
    expect(validatePluginJS(null)).toBe(false);
  });

  test("returns false if data is not an object", () => {
    expect(validatePluginJS("string")).toBe(false);
    expect(validatePluginJS(123)).toBe(false);
    expect(validatePluginJS(true)).toBe(false);
  });

  test("returns false if missing name", () => {
    const obj: Partial<PluginParamsObject> = {
      status: true,
      description: "desc",
      parameters: { a: "b" },
    };
    expect(validatePluginJS(obj)).toBe(false);
  });

  test("returns false if missing status", () => {
    const obj: Partial<PluginParamsObject> = {
      name: "Test",
      description: "desc",
      parameters: { a: "b" },
    };
    expect(validatePluginJS(obj)).toBe(false);
  });

  test("returns false if missing description", () => {
    const obj: Partial<PluginParamsObject> = {
      name: "Test",
      status: true,
      parameters: { a: "b" },
    };
    expect(validatePluginJS(obj)).toBe(false);
  });

  test("returns false if parameters is missing", () => {
    const obj: Partial<PluginParamsObject> = {
      name: "Test",
      status: true,
      description: "desc",
    };
    expect(validatePluginJS(obj)).toBe(false);
  });

  test("returns false if parameters is not an object", () => {
    const obj = {
      name: "Test",
      status: true,
      description: "desc",
      parameters: "not-an-object",
    };
    expect(validatePluginJS(obj)).toBe(false);
  });

  test("returns false if parameters is null", () => {
    const obj = {
      name: "Test",
      status: true,
      description: "desc",
      parameters: null,
    };
    expect(validatePluginJS(obj)).toBe(false);
  });

  test("returns false if any parameter value is not a string", () => {
    const obj = {
      name: "Test",
      status: true,
      description: "desc",
      parameters: {
        a: "b",
        c: 123,
      },
    };
    expect(validatePluginJS(obj)).toBe(false);
  });

  test("returns true for empty parameters object", () => {
    const obj = {
      name: "Test",
      status: true,
      description: "desc",
      parameters: {},
    };
    expect(validatePluginJS(obj)).toBe(true);
  });
});
