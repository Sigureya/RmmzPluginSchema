import { describe, test, expect } from "vitest";
import type { DescAndText } from "./flashState";
import { withTexts } from "./flashState";

describe("withTexts", () => {
  test("both desc and text are present", () => {
    const command: DescAndText = {
      desc: "This is a description.",
      text: "This is a text.",
    };
    const result = withTexts(command);
    expect(result).toEqual(command);
  });
  test("only desc is present", () => {
    const command: DescAndText = {
      desc: "This is a description.",
    };
    const result = withTexts(command);
    expect(result).toEqual(command);
  });
  test("only text is present", () => {
    const command: DescAndText = {
      text: "This is a text.",
    };
    const result = withTexts(command);
    expect(result).toEqual(command);
  });
  test("neither desc nor text is present", () => {
    const command: DescAndText = {};
    const result = withTexts(command);
    expect(result).toEqual({});
  });
  test("desc and text are explicitly set to undefined", () => {
    const command: DescAndText = {
      desc: undefined,
      text: undefined,
    };
    const result = withTexts(command);
    expect(result).toEqual({});
  });
});
