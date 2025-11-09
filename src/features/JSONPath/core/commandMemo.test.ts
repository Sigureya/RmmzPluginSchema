import { describe, expect, test } from "vitest";
import {
  buildCommandPathSchema,
  createSchemaJsonPathPair,
} from "./commandMemo";
import type {
  StructPathResult,
  StructPropertysPath,
} from "./value/types/pathSchemaTypes";

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

const structsPath: StructPathResult = {
  errors: [],
  items: [
    {
      structName: "Damage",
      objectSchema: { exprFunc: { default: "", kind: "string" } },
      scalaArrays: [],
      scalas: '$.damage["exprFunc"]',
    },
    {
      structName: "Message",
      objectSchema: {
        failure: { default: "", kind: "string" },
        success: { default: "", kind: "string" },
      },
      scalaArrays: [],
      scalas: '$.message["success","failure"]',
    },
  ],
};

const structArrays: StructPathResult = {
  errors: [],
  items: [
    {
      structName: "Effect",
      objectSchema: {
        code: { default: 0, kind: "number" },
        value: { default: 0, kind: "number" },
      },
      scalaArrays: [],
      scalas: '$.effects[*]["code","value"]',
    },
  ],
};
describe(",", () => {
  test("", () => {
    const result = buildCommandPathSchema({
      scalars: scalarsPath,
      structArrays: structArrays,
      structs: structsPath,
    });
    expect(result).lengthOf(5);
  });
});

describe("", () => {
  test("", () => {
    const result = createSchemaJsonPathPair(scalarsPath);
    expect(result).lengthOf(2);
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
