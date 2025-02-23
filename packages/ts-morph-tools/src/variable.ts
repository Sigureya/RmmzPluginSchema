import type {
  Expression,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  SourceFile,
  VariableDeclaration,
} from "ts-morph";
import { SyntaxKind } from "ts-morph";

export const pirmitiveLiteral = (expr: Expression) => {
  if (expr.isKind(SyntaxKind.NumericLiteral)) {
    return expr.getLiteralValue();
  }
  if (expr.isKind(SyntaxKind.StringLiteral)) {
    return expr.getLiteralValue();
  }
  if (expr.isKind(SyntaxKind.TrueKeyword)) {
    return expr.getLiteralValue();
  }
  if (expr.isKind(SyntaxKind.FalseKeyword)) {
    return expr.getLiteralValue();
  }
};
export const getLiteralObject = (initializer: ObjectLiteralExpression) => {
  type Result = Record<string, unknown>;
  return initializer
    .getProperties()
    .reduce<Result>((acc, prop: ObjectLiteralElementLike) => {
      if (!prop.isKind(SyntaxKind.PropertyAssignment)) {
        return acc;
      }
      const valueExpr = prop.getInitializer();
      if (valueExpr === undefined) {
        return acc;
      }
      const value = pirmitiveLiteral(valueExpr);
      if (value === undefined) {
        return acc;
      }
      const key = prop.getName();
      acc[key] = value;
      return acc;
    }, {});
};

const sss = (src: SourceFile): Record<string, unknown>[] => {
  return src
    .getVariableDeclarations()
    .filter((v) => v.getType().getText().includes("NumberArg"))
    .map((v: VariableDeclaration) => {
      const initializer = v.getInitializer();
      if (initializer?.isKind(SyntaxKind.ObjectLiteralExpression)) {
        return getLiteralObject(initializer);
      }
      return undefined;
    })
    .filter((v) => v !== undefined);
};
