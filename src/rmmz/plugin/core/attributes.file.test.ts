import { describe, expect, test, vi } from "vitest";
import type { ParamSoruceRecord } from "./attributes";
import { compileAttributes } from "./attributes";
import type { FileParam, FileArrayParam } from "./params";
import type { PluginParamTokens } from "./parse";

describe("compileAttributes - file", () => {
  test("minimum set", () => {
    const tokens: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "file",
        default: "path/to/file.txt",
      } satisfies ParamSoruceRecord<FileParam>,
    };
    const fn = vi.fn(() => {});
    const result = compileAttributes(tokens, fn);
    const expected: FileParam = {
      kind: "file",
      default: "path/to/file.txt",
      dir: "",
    };
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
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
    const fn = vi.fn(() => {});

    const result = compileAttributes(tokens, fn);
    const expected: FileParam = {
      kind: "file",
      default: "path/to/file.txt",
      text: "File Path",
      desc: "Description of the file path",
      parent: "Parent File",
      dir: "img",
    };
    expect(result).toEqual(expected);
    expect(fn).not.toHaveBeenCalled();
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

    const result = compileAttributes(tokens);
    const expected: FileArrayParam = {
      kind: "file[]",
      default: ["path/to/file1.txt", "path/to/file2.txt"],
      dir: "",
    };
    expect(result).toEqual(expected);
  });

  test("empty array", () => {
    const tokens: PluginParamTokens = {
      name: "attr",
      attr: {
        kind: "file[]",
        default: `[]`,
      } satisfies ParamSoruceRecord<FileArrayParam>,
    };

    const result = compileAttributes(tokens);
    const expected: FileArrayParam = {
      kind: "file[]",
      default: [],
      dir: "",
    };
    expect(result).toEqual(expected);
  });
});
