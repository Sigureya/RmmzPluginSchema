import type {
  AnnotationBase,
  Primitive_Numbers,
  Primitive_Strings,
  BooleanAnnotation,
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
  [Key in keyof T]: ParamType<T[Key]>;
};

export type ParamType<T> = T extends number | string | boolean
  ? Primitive<T>
  : T extends number[] | string[]
  ? PrimitiveArray<T>
  : T extends object[]
  ? Type_StructArray<T, Struct<T[number]>>
  : T extends object
  ? Type_Struct<T, Struct<T>>
  : never;

export type AnnotationTypes =
  | Type_StructArray<object[]>
  | Type_Struct<object>
  | BooleanAnnotation
  | Primitive_Numbers
  | Primitive_NumbersArray
  | Primitive_Strings
  | Primitive_StringsArray;

export interface HasStruct extends Omit<AnnotationBase, "default"> {
  struct: StructBase;
  default?: unknown;
}

export interface Type_StructArray<
  Array extends object[],
  ArrayAnnotation extends StructBase = StructBase
> extends HasStruct {
  type: "struct[]";
  struct: ArrayAnnotation;
  default: Array;
}

export interface Type_Struct<
  T extends object,
  StructAnnotation extends StructBase = Struct<T>
> extends HasStruct {
  type: "struct";
  struct: StructAnnotation;
  default?: T;
}
