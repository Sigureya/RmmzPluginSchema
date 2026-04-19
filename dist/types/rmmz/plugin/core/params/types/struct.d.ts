import { ParamBase } from './paramBase';
export interface KindOfStructBase extends ParamBase {
    struct: string;
}
/**
 * - 型を参照するだけのパラメータ。別の箇所に型定義があることを前提としている。
 */
export interface StructRefParam extends KindOfStructBase {
    kind: "struct";
    struct: string;
    default?: object;
}
export interface StructArrayRefParam extends KindOfStructBase {
    kind: "struct[]";
    struct: string;
    default?: object[];
}
