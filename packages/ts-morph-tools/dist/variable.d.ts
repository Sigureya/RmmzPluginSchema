import { Expression, ObjectLiteralExpression } from 'ts-morph';
export declare const pirmitiveLiteral: (expr: Expression) => string | number | boolean | undefined;
export declare const getLiteralObject: (initializer: ObjectLiteralExpression) => Record<string, unknown>;
