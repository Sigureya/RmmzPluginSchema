import { describe, test, expect } from "vitest";
import type { ClassifiedPluginParamsEx } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import { makeScalarValuesPath, makeScalarArrayPath } from "./scalarValue";
import type { PathPair } from "./types/types";

interface ArrayMock {
  numberArray: number[];
  stringArray: string[];
  files: string[];
}

interface ScalaMock {
  stringParam: string;
  numberParam: number;
  booleanParam: boolean;
}

describe("makeScalaParams", () => {
  describe("empty scalas", () => {
    const schema: ClassifiedPluginParamsEx<ScalaMock> = {
      structs: [],
      structArrays: [],
      scalars: [],
      scalarArrays: [],
    };
    test("undefined", () => {
      const path = makeScalarValuesPath(schema.scalars, "$");
      expect(path).toBeUndefined();
    });
  });
  describe("scala params", () => {
    const mockData = {
      stringParam: "hello",
      numberParam: 42,
      booleanParam: true,
    } as const satisfies ScalaMock;
    const schema: ClassifiedPluginParamsEx<ScalaMock> = {
      structs: [],
      structArrays: [],
      scalars: [
        { name: "stringParam", attr: { kind: "string", default: "" } },
        { name: "numberParam", attr: { kind: "number", default: 0 } },
        { name: "booleanParam", attr: { kind: "boolean", default: false } },
      ],
      scalarArrays: [],
    };
    const path = `$["stringParam","numberParam","booleanParam"]`;
    test("path", () => {
      const path1 = makeScalarValuesPath(schema.scalars, "$");
      expect(path1).toBe(path);
    });
    test("find", () => {
      const jsonPath = new JSONPathJS(path);
      const result = jsonPath.pathSegments(mockData);
      const expected: typeof result = [
        { value: "hello", segments: ["stringParam"] },
        { value: 42, segments: ["numberParam"] },
        { value: true, segments: ["booleanParam"] },
      ];
      expect(result).toEqual(expected);
    });
  });
});

describe("makeScalaArrayParams", () => {
  const mockData = {
    numberArray: [211, 217, 235],
    stringArray: ["a", "b", "c"],
    files: ["face.png", "icon.png"],
  } as const satisfies ArrayMock;
  const schema: ClassifiedPluginParamsEx<ArrayMock> = {
    structs: [],
    structArrays: [],
    scalars: [],
    scalarArrays: [
      { name: "numberArray", attr: { kind: "number[]", default: [] } },
      { name: "stringArray", attr: { kind: "string[]", default: [] } },
      { name: "files", attr: { kind: "file[]", default: [], dir: "img" } },
    ],
  };
  const paths = [
    {
      path: "$.numberArray[*]",
      param: schema.scalarArrays[0],
    },
    {
      path: "$.stringArray[*]",
      param: schema.scalarArrays[1],
    },
    {
      path: "$.files[*]",
      param: schema.scalarArrays[2],
    },
  ] as const satisfies PathPair[];

  test("create path", () => {
    const path1: PathPair[] = makeScalarArrayPath(schema.scalarArrays, "$");
    expect(path1).toEqual(paths);
  });
  test("find number params", () => {
    const jsonPath = new JSONPathJS(paths[0].path);
    const result = jsonPath.pathSegments(mockData);
    const expected: typeof result = [
      { value: 211, segments: ["numberArray", 0] },
      { value: 217, segments: ["numberArray", 1] },
      { value: 235, segments: ["numberArray", 2] },
    ];
    expect(result).toEqual(expected);
  });
  test("find string params", () => {
    const jsonPath = new JSONPathJS(paths[1].path);
    const result = jsonPath.pathSegments(mockData);
    const expected: typeof result = [
      { value: "a", segments: ["stringArray", 0] },
      { value: "b", segments: ["stringArray", 1] },
      { value: "c", segments: ["stringArray", 2] },
    ];
    expect(result).toEqual(expected);
  });
  test("find file params", () => {
    const jsonPath = new JSONPathJS(paths[2].path);
    const result = jsonPath.pathSegments(mockData);
    const expected: typeof result = [
      { value: "face.png", segments: ["files", 0] },
      { value: "icon.png", segments: ["files", 1] },
    ];
    expect(result).toEqual(expected);
  });
});
