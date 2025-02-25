import type { StructNode_Error } from "./errors";
import type {
  AnnotationBase,
  Primitive_Numbers,
  Primitive_Strings,
  BooleanArg,
  Primitive_NumbersArray,
  Primitive_StringsArray,
  Primitive,
  PrimitiveArray,
} from "./primitive";

export interface StructBase {
  structName: string;
  params: ParameterBase;
}
export interface ParameterBase extends Record<string, AnnotationTypes> {}

export interface Struct<T extends object> extends StructBase {
  structName: string;
  params: StructParameters<T>;
}

export type StructParameters<T> = {
  [Key in Extract<keyof T, string>]: ParamType<T[Key]>;
};

export type ParamType<T> = T extends number | string | boolean
  ? Primitive<T>
  : T extends number[] | string[]
  ? PrimitiveArray<T>
  : T extends object[]
  ? Type_StructArray<T>
  : T extends object
  ? Type_Struct<T>
  : StructNode_Error<"unknown">;

export type AnnotationTypes =
  | Type_StructArray<object[]>
  | Type_Struct<object>
  | AnnotationPrimitiveTypes
  | StructNode_Error;

export type AnnotationPrimitiveTypes =
  | BooleanArg
  | Primitive_Numbers
  | Primitive_NumbersArray
  | Primitive_Strings
  | Primitive_StringsArray;

export interface HasStruct extends Omit<AnnotationBase, "default"> {
  struct: StructBase;
  default?: unknown;
}

export interface Type_StructArray<Array extends object[]> extends HasStruct {
  type: "struct[]";
  struct: Struct<Array[number]>;
  default: Array;
}

export interface Type_Struct<T extends object> extends HasStruct {
  type: "struct";
  struct: Struct<T>;
  default?: T;
}
