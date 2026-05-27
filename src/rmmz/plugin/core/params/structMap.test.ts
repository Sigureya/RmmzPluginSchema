import { describe, expect, test } from "vitest";
import { createClassifiedStructMap, createStructMap } from "./structMap";
import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsTyped,
  PluginArrayParamType,
  PluginParamEx2,
  PluginScalarParam,
  PluginStructSchemaArray,
  PluginStructSchemaArrayFiltered,
  PrimitiveParam,
} from "./types";

describe("createClassifiedStructMap", () => {
  const bundle: PluginStructSchemaArrayFiltered<
    PluginParamEx2<PluginScalarParam, PluginArrayParamType>
  >[] = [
    {
      struct: "Actor",
      params: [
        { name: "name", attr: { kind: "string", default: "" } },
        { name: "hp", attr: { kind: "number", default: 1 } },
        { name: "tags", attr: { kind: "string[]", default: [] } },
        { name: "profile", attr: { kind: "struct", struct: "Profile" } },
        { name: "items", attr: { kind: "struct[]", struct: "Item" } },
      ],
    },
    {
      struct: "Profile",
      params: [
        { name: "bio", attr: { kind: "string", default: "" } },
        { name: "level", attr: { kind: "number", default: 1 } },
      ],
    },
  ];
  test("size", () => {
    const result: Map<
      string,
      ClassifiedPluginParamsTyped<PluginScalarParam, PluginArrayParamType>
    > = createClassifiedStructMap(bundle);

    expect(result.size).toBe(2);
  });
  test("actor", () => {
    const result: Map<string, ClassifiedPluginParams> =
      createClassifiedStructMap(bundle);
    const expectedActor: ClassifiedPluginParams = {
      scalars: [
        { name: "name", attr: { kind: "string", default: "" } },
        { name: "hp", attr: { kind: "number", default: 1 } },
      ],
      scalarArrays: [{ name: "tags", attr: { kind: "string[]", default: [] } }],
      structs: [
        { name: "profile", attr: { kind: "struct", struct: "Profile" } },
      ],
      structArrays: [
        { name: "items", attr: { kind: "struct[]", struct: "Item" } },
      ],
    };
    const actor = result.get("Actor");
    expect(actor).toBeDefined();
    expect(actor).toEqual(expectedActor);
  });
  test("Profile", () => {
    const result: Map<
      string,
      ClassifiedPluginParamsTyped<PluginScalarParam, PluginArrayParamType>
    > = createClassifiedStructMap(bundle);

    const expectedProfile: ClassifiedPluginParams = {
      scalars: [
        { name: "bio", attr: { kind: "string", default: "" } },
        { name: "level", attr: { kind: "number", default: 1 } },
      ],
      scalarArrays: [],
      structs: [],
      structArrays: [],
    };

    const profile = result.get("Profile");
    expect(profile).toBeDefined();
    expect(profile).toEqual(expectedProfile);
  });
});

describe("createStructMap", () => {
  test("struct名をキーにattr配列のMapを返す", () => {
    const structs: PluginStructSchemaArray[] = [
      {
        struct: "Item",
        params: [
          { name: "id", attr: { kind: "number", default: 0 } },
          { name: "name", attr: { kind: "string", default: "" } },
        ],
      },
      {
        struct: "Profile",
        params: [
          { name: "memo", attr: { kind: "multiline_string", default: "" } },
        ],
      },
    ];

    const result: Map<string, PrimitiveParam[]> = createStructMap(structs);

    expect(result.size).toBe(2);
    expect(result.get("Item")).toEqual([
      { kind: "number", default: 0 },
      { kind: "string", default: "" },
    ]);
    expect(result.get("Profile")).toEqual([
      { kind: "multiline_string", default: "" },
    ]);
  });
});
