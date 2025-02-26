import type { BooleanArg } from "./boolean";
import type { Primitive_Numbers, Primitive_NumbersArray } from "./numbers";
import type { Primitive_Strings, Primitive_StringsArray } from "./strings";

export type AnnotationPrimitiveTypes =
  | BooleanArg
  | Primitive_Numbers
  | Primitive_NumbersArray
  | Primitive_Strings
  | Primitive_StringsArray;
