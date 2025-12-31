import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compilePluginParam } from "./attributes";
import type { DeepJSONParserHandlers } from "./deepJSONHandler";
import { createDeepJSONParserHandlers } from "./deepJSONHandler";
import type { FileParam, FileArrayParam } from "./params";
import type { PluginParamTokens } from "./parse";

const createHandlers = (): MockedObject<DeepJSONParserHandlers> => {
  const parser = createDeepJSONParserHandlers();
  return {
    parseStringArray: vi.fn((s: string) => parser.parseStringArray(s)),
    parseObject: vi.fn((s: string) => parser.parseObject(s)),
    parseObjectArray: vi.fn((s: string) => parser.parseObjectArray(s)),
  };
};

describe("compileAttributes - file", () => {
  test("minimum set", () => {
    const tokens: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "file",
        default: "path/to/file.txt",
      } satisfies ParamSoruceRecord<FileParam>,
    };
    const mockHandlers = createHandlers();
    const result = compilePluginParam(tokens, mockHandlers);
    const expected: FileParam = {
      kind: "file",
      default: "path/to/file.txt",
      dir: "",
    };
    expect(result.attr).toEqual(expected);
    expect(mockHandlers.parseStringArray).not.toHaveBeenCalled();
    expect(mockHandlers.parseObject).not.toHaveBeenCalled();
    expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
  });

  test("full set", () => {
    const tokens: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "file",
        default: "path/to/file.txt",
        text: "File Path",
        desc: "Description of the file path",
        parent: "Parent File",
        dir: "img",
      } satisfies ParamSoruceRecord<FileParam>,
    };
    const mockHandlers = createHandlers();

    const result = compilePluginParam(tokens, mockHandlers);
    const expected: FileParam = {
      kind: "file",
      default: "path/to/file.txt",
      text: "File Path",
      desc: "Description of the file path",
      parent: "Parent File",
      dir: "img",
    };
    expect(result.attr).toEqual(expected);
    expect(mockHandlers.parseStringArray).not.toHaveBeenCalled();
    expect(mockHandlers.parseObject).not.toHaveBeenCalled();
    expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
  });
});

describe("compileAttributes - file[]", () => {
  test("minimum set", () => {
    const tokens: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "file[]",
        default: `["path/to/file1.txt", "path/to/file2.txt"]`,
      } satisfies ParamSoruceRecord<FileArrayParam>,
    };

    const mockHandlers = createHandlers();

    const result = compilePluginParam(tokens, mockHandlers);
    const expected: FileArrayParam = {
      kind: "file[]",
      default: ["path/to/file1.txt", "path/to/file2.txt"],
      dir: "",
    };
    expect(result.attr).toEqual(expected);
    expect(mockHandlers.parseStringArray).toHaveBeenCalledWith(
      tokens.attr.default
    );
    expect(mockHandlers.parseStringArray).toHaveBeenCalledTimes(1);
    expect(mockHandlers.parseObject).not.toHaveBeenCalled();
    expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
  });

  test("empty array", () => {
    const tokens: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "file[]",
        default: `[]`,
      } satisfies ParamSoruceRecord<FileArrayParam>,
    };
    const mockHandlers = createHandlers();

    const result = compilePluginParam(tokens, mockHandlers);
    const expected: FileArrayParam = {
      kind: "file[]",
      default: [],
      dir: "",
    };
    expect(result.attr).toEqual(expected);
    expect(mockHandlers.parseStringArray).toHaveBeenCalledWith(
      tokens.attr.default
    );
    expect(mockHandlers.parseStringArray).toHaveBeenCalledTimes(1);
    expect(mockHandlers.parseObject).not.toHaveBeenCalled();
    expect(mockHandlers.parseObjectArray).not.toHaveBeenCalled();
  });
});
