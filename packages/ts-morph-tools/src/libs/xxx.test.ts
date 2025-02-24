import { Project, ts } from "ts-morph";
import { describe, expect, test } from "vitest";
// import type { NumberArg } from "../../../schema/src";
// import type { NumberArg } from "@sigureya/schema";

describe("", () => {
  const ant = {
    type: "number",
    default: 42,
  } as const;
  const project = new Project();
  const sourceFile = project.createSourceFile(
    "test.ts",
    `
    const TEST_DATA: NumberArg = {
      type: "number",
      default: 42
    };
  `
  );
  const variable = sourceFile
    .getVariableDeclarations()
    .find((v) => v.getType().getText().includes("NumberArg"));
  test("定数オブジェクトを解析できること", () => {
    expect(variable).toBeDefined();
    const initializer = variable!.getInitializer();
    expect(initializer?.isKind(ts.SyntaxKind.ObjectLiteralExpression)).toBe(
      true
    );
    const xx = initializer?.getText() ?? "";

    expect(xx.replaceAll(/\s/g, "")).toBe(`{type:"number",default:42}`);

    expect(JSON.parse(xx!)).toEqual(ant);
  });
});
