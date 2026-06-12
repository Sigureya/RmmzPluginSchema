import { describe, expect, test } from "vitest";
import schema from "./paramUnion.schema.json";
import { SCHEMA_PRIMITIVE_PARAM } from "./schema";

describe("paramUnionSchema", () => {
  test("should match the schema", () => {
    expect(SCHEMA_PRIMITIVE_PARAM).toEqual(schema);
  });
});
