import { Primitive, PrimitiveArray } from "./primitive";
import { StructBase, Type_StructArray, Type_Struct } from "./structBase";

export type ParamType <T> =
T extends ( number | string | boolean) ? Primitive<T> :
T extends number[] | string[] ? PrimitiveArray<T> :
T extends object[] ? Type_StructArray<T, Struct<T[number]>> :
T extends object ? Type_Struct<T, Struct<T>> :
never;

export interface Struct<T extends object> extends StructBase {
  params: {
    [Key in keyof T]:ParamType< T[Key]>
  };
}

export type Parameter<T extends object> = Struct<T>["params"];
