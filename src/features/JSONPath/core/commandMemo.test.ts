import { describe, expect, test } from "vitest";
import { createSchemaJsonPathPair } from "./commandMemo";
import type { StructPropertysPath } from "./value/types/pathSchemaTypes";

describe("", () => {
  test("", () => {
    const scalarsPath: StructPropertysPath = {
      structName: "Action",
      objectSchema: {
        subject: { default: 0, kind: "number" },
      },
      scalaArrays: [],
      scalas: undefined,
    };
    const result = createSchemaJsonPathPair(scalarsPath);
    expect(result).toEqual([]);
  });
  test("", () => {
    const scalarsPath: StructPropertysPath = {
      structName: "Action",
      objectSchema: {
        subject: { default: 0, kind: "number" },
      },
      scalaArrays: [
        {
          param: { attr: { default: [], kind: "number[]" }, name: "targets" },
          path: "$.targets[*]",
        },
      ],
      scalas: '$["subject"]',
    };
    const result = createSchemaJsonPathPair(scalarsPath);
    expect(result).lengthOf(2);
  });
  test("", () => {
    const structArrays: StructPropertysPath = {
      structName: "Effect",
      objectSchema: {
        code: { default: 0, kind: "number" },
        value: { default: 0, kind: "number" },
      },
      scalaArrays: [],
      scalas: '$.effects[*]["code","value"]',
    };
    const result = createSchemaJsonPathPair(structArrays);
    expect(result).lengthOf(1);
  });
  test("", () => {
    const path: StructPropertysPath = {
      structName: "Message",
      objectSchema: {
        failure: { default: "", kind: "string" },
        success: { default: "", kind: "string" },
      },
      scalaArrays: [],
      scalas: '$.message["success","failure"]',
    };

    const result = createSchemaJsonPathPair(path);
    expect(result).lengthOf(1);
  });
});
