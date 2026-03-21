import { describe, expect, test } from "vitest";
import { isErrorStructParam } from "./structError";
import type {
  ParamError,
  PrimitiveParam,
  StructArrayRefParam,
  StructRefParam,
} from "./types";

const error: ParamError = {
  attr: "test",
  code: "error_code",
  message: "error message",
  source: "test_source",
};

const matchParams: (StructArrayRefParam | StructRefParam)[] = [
  {
    kind: "struct",
    struct: "TestStruct",
    errors: [error],
  },
  {
    kind: "struct[]",
    struct: "TestStruct",
    errors: [error],
  },
  {
    kind: "struct",
    struct: "TestStruct",
    errors: [error, error],
  },
  {
    kind: "struct[]",
    struct: "TestStruct",
    errors: [error, error],
  },
];

const notMatchParams: PrimitiveParam[] = [
  {
    kind: "struct",
    struct: "TestStruct",
    default: {},
    errors: [],
  },
  {
    kind: "struct[]",
    struct: "TestStruct",
    default: [],
    errors: [],
  },
  {
    kind: "string",
    default: "default",
  },
  {
    kind: "number",
    default: 0,
  },
];

describe("isErrorStructParam", () => {
  describe("matches error struct params", () => {
    test.each(matchParams)("matches error struct param %#", (param) => {
      expect(param, param.kind).toSatisfy(isErrorStructParam);
    });
  });
  describe("does not match non-error struct params", () => {
    test.each(notMatchParams)(
      "does not match non-error struct param %#",
      (param) => {
        expect(param, param.kind).not.toSatisfy(isErrorStructParam);
      },
    );
  });
});
