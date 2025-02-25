import { StructNode_Error } from './errors';
import { AnnotationBase, Primitive, PrimitiveArray, AnnotationPrimitiveTypes } from './primitive';
interface StructBase {
    structName: string;
    params: ParameterBase;
}
interface ParameterBase extends Record<string, AnnotationTypes> {
}
interface Struct<T extends object> extends StructBase {
    structName: string;
    params: StructParameters<T>;
}
type StructParameters<T> = {
    [Key in Extract<keyof T, string>]: ParamType<T[Key]>;
};
type ParamType<T> = T extends number | string | boolean ? Primitive<T> : T extends number[] | string[] ? PrimitiveArray<T> : T extends object[] ? Type_StructArray<T> : T extends object ? Type_Struct<T> : StructNode_Error<"unknown">;
export type AnnotationTypes = Type_StructArray<object[]> | Type_Struct<object> | AnnotationPrimitiveTypes | StructNode_Error;
interface HasStruct extends Omit<AnnotationBase, "default"> {
    struct: StructBase;
    default?: unknown;
}
interface Type_StructArray<Array extends object[]> extends HasStruct {
    type: "struct[]";
    struct: Struct<Array[number]>;
    default: Array;
}
interface Type_Struct<T extends object> extends HasStruct {
    type: "struct";
    struct: Struct<T>;
    default?: T;
}
export {};
