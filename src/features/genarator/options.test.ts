import { describe, expect, test } from "vitest";
import type { ComboParam, SelectParam } from "@RmmzPluginSchema/rmmz/plugin";
import { generateComboOptions, generateSelectOptions } from "./options";
import type { KeyWord } from "./types";

describe("generateSelectOptions", () => {
  test("generates correct option lines for select param", () => {
    const param: SelectParam = {
      kind: "select",
      desc: "Select an option.",
      default: "A",
      options: [
        { option: "Option A", value: "A" },
        { option: "Option B", value: "B" },
      ],
    };
    const expected: KeyWord<"option" | "value">[] = [
      `@option Option A`,
      `@value A`,
      `@option Option B`,
      `@value B`,
    ];
    const optionLines = generateSelectOptions(param);
    expect(optionLines).toEqual(expected);
  });
});

describe("generateComboOptions", () => {
  test("generates correct option lines for combo param", () => {
    const param: ComboParam = {
      kind: "combo",
      desc: "Choose a combo option.",
      default: "X",
      options: ["X", "Y", "Z"],
    };
    const expected: KeyWord<"option">[] = [
      `@option X`,
      `@option Y`,
      `@option Z`,
    ];
    const optionLines = generateComboOptions(param);
    expect(optionLines).toEqual(expected);
  });
});
