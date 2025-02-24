import { describe, test, expect } from "vitest";
import {
  baseAnnotion,
  numberArgAnnotations,
  selectAnnotations,
  typeAnnotation,
  formatBooleanAnnotation,
  booleanArgAnnotations,
} from "./makeAnnotation";
import type { BooleanArg, NumberArg, Primitive_NumbersArray } from "./types";

describe("number", () => {
  describe("single a", () => {
    const mockNumber: NumberArg = {
      default: 123,
      text: "test text",
      type: "number",
    };
    test("type", () => {
      const result = typeAnnotation(mockNumber);
      expect(result).toEqual("@type number");
    });
    test("base", () => {
      const result = baseAnnotion(mockNumber);
      expect(result).toEqual(["@text test text"]);
    });
    test("numberArg", () => {
      const result = numberArgAnnotations(mockNumber);
      expect(result).toEqual([]);
    });
  });
  describe("single b", () => {
    const mockNumber: NumberArg = {
      default: 123,
      type: "number",
      parent: "grand",
      min: 1,
      max: 4,
      digit: 2,
    };
    test("base", () => {
      const result = baseAnnotion(mockNumber);
      expect(result).toEqual(["@parent grand"]);
    });
    test("numberArg", () => {
      const result = numberArgAnnotations(mockNumber);
      expect(result).toEqual(["@min 1", "@max 4", "@digit 2"]);
    });
  });

  describe("array", () => {
    const mockNumberArray: Primitive_NumbersArray = {
      default: [1, 2, 3],
      type: "number[]",
      min: 1,
      max: 4,
    };
    test("", () => {
      const result = baseAnnotion(mockNumberArray);
      expect(result).toEqual([]);
    });
    test("", () => {
      const result = numberArgAnnotations(mockNumberArray);
      expect(result).toEqual(["@min 1", "@max 4"]);
    });
  });
});
describe("select", () => {
  const mockSelect = {
    type: "select",
    options: [
      { option: "a", value: 1 },
      { option: "b", value: 2 },
    ],
  };
  test("base", () => {
    const result = typeAnnotation(mockSelect);
    expect(result).toEqual("@type select");
  });
  test("select", () => {
    const result = selectAnnotations(mockSelect);
    expect(result).toEqual(["@option a", "@value 1", "@option b", "@value 2"]);
  });
});

describe("formatBooleanAnnotation", () => {
  describe("without dictionary", () => {
    test("on", () => {
      const result = formatBooleanAnnotation({ on: "enabled" }, "on");
      expect(result).toEqual("@on enabled");
    });
    test("off", () => {
      const result = formatBooleanAnnotation({ off: "disabled" }, "off");
      expect(result).toEqual("@off disabled");
    });
    test("undefined on", () => {
      const result = formatBooleanAnnotation({}, "on");
      expect(result).toEqual(undefined);
    });
    test("undefined off", () => {
      const result = formatBooleanAnnotation({}, "off");
      expect(result).toEqual(undefined);
    });
  });

  describe("formatBooleanAnnotation with dictionary", () => {
    test("on with dictionary", () => {
      const dic = { enabled: "有効" };
      const result = formatBooleanAnnotation({ on: "enabled" }, "on", dic);
      expect(result).toEqual("@on 有効");
    });

    test("off with dictionary", () => {
      const dic = { disabled: "無効" };
      const result = formatBooleanAnnotation({ off: "disabled" }, "off", dic);
      expect(result).toEqual("@off 無効");
    });

    test("dictionary without matching key", () => {
      const dic = { other: "別の値" }; // "enabled" や "disabled" は含まれない
      const result = formatBooleanAnnotation({ on: "enabled" }, "on", dic);
      expect(result).toEqual("@on enabled"); // 変換されずそのまま
    });
  });
});

describe("booleanArgAnnotations", () => {
  describe("without dictionary", () => {
    test("on", () => {
      const result = booleanArgAnnotations({ on: "enabled" });
      expect(result).toEqual(["@on enabled"]);
    });
    test("off", () => {
      const result = booleanArgAnnotations({ off: "disabled" });
      expect(result).toEqual(["@off disabled"]);
    });
    test("on off", () => {
      const result = booleanArgAnnotations({ on: "enabled", off: "disabled" });
      expect(result).toEqual(["@on enabled", "@off disabled"]);
    });

    test("undefined", () => {
      const result = booleanArgAnnotations({});
      expect(result).toEqual([]);
    });
  });

  describe("booleanArgAnnotations with unexpected values", () => {
    test("on with null", () => {
      const result = booleanArgAnnotations({
        on: null as unknown as undefined,
      });
      expect(result).toEqual([]);
    });

    test("off with null", () => {
      const result = booleanArgAnnotations({
        off: null as unknown as undefined,
      });
      expect(result).toEqual([]);
    });

    test("on with undefined explicitly", () => {
      const bool: BooleanArg = {
        on: undefined,
        type: "boolean",
        default: true,
      };
      const result = booleanArgAnnotations(bool);
      expect(result).toEqual([]);
    });

    test("unexpected key is ignored", () => {
      const bool: BooleanArg = {
        on: "enabled",
        type: "boolean",
        default: true,
      };
      const result = booleanArgAnnotations(bool);
      expect(result).toEqual(["@on enabled"]);
    });
  });

  describe("booleanArgAnnotations with dictionary", () => {
    test("on with dictionary", () => {
      const dic = { enabled: "有効" };
      const result = booleanArgAnnotations({ on: "enabled" }, dic);
      expect(result).toEqual(["@on 有効"]);
    });

    test("on off with dictionary", () => {
      const dic = { enabled: "有効", disabled: "無効" };
      const result = booleanArgAnnotations(
        { on: "enabled", off: "disabled" },
        dic
      );
      expect(result).toEqual(["@on 有効", "@off 無効"]);
    });

    test("dictionary without matching key", () => {
      const dic = { other: "別の値" }; // 変換対象のキーがない
      const result = booleanArgAnnotations(
        { on: "enabled", off: "disabled" },
        dic
      );
      expect(result).toEqual(["@on enabled", "@off disabled"]); // そのまま
    });
  });
});
