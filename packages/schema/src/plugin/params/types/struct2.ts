import type { StructNode_Error } from "./errors";
import type {
  AnnotationBaseTexts,
  Primitive,
  PrimitiveArray,
  AnnotationPrimitiveTypes,
} from "./primitive";
export interface StructBase2 {
  structName: string;
  params: ParameterBase2;
}
export interface ParameterBase2
  extends Record<
    string,
    AnnotationTypes2 | AnnotationPrimitiveTypes | StructUnion
  > {}

export interface Struct<T extends object>
  extends NodeItem_Struct<T, T, "root"> {}

type StructUnion =
  | NodeItem_Array<object[], object, string>
  | NodeItem_Struct<object, object, string>
  | NodeItem_TypelessStruct<object>;

interface StructType2<
  T extends object,
  KnowTypes extends object,
  Path extends string = ""
> {
  structName: string;
  params: StructParametersNode<T, KnowTypes, Path>;
}

export type StructParameters2<T extends object> = StructParametersNode<
  T,
  T,
  "root"
>;
type StructParametersNode<
  T extends object,
  KnowTypes extends object,
  Path extends string
> = {
  [Key in Extract<keyof T, string>]: ParamType2<
    T[Key],
    KnowTypes,
    `${Path}.${Key}`
  >;
};

export type AnnotationTypes2 =
  | AnnotationPrimitiveTypes
  | StructNode_Error
  | StructUnion;

export type ParamType2<
  T,
  KnowTypes extends object,
  Path extends string = "?"
> = T extends number | string | boolean
  ? Primitive<T>
  : T extends number[] | string[]
  ? PrimitiveArray<T>
  : T extends KnowTypes
  ? StructNode_Error<Path>
  : T extends KnowTypes[]
  ? StructNode_Error<`${Path}[]`>
  : T extends object[]
  ? NodeItem_Array<T, KnowTypes, Path>
  : T extends object
  ? NodeItem_Struct<T, KnowTypes, Path> | NodeItem_TypelessStruct<T>
  : StructNode_Error<`never:${Path}`>;

export type StructUnion2<T extends object = object> =
  | StructWithName<T>
  | StructWithParams<T>
  | StructWithDefault<T>
  | StructComplete<T>;

export interface BaseStruct<T extends object> extends AnnotationBaseTexts {
  type: "struct";
  struct?: {
    structName?: string;
    params?: ParameterBase2;
  };
  default?: T;
}

export interface StructComplete<T extends object = object>
  extends BaseStruct<T> {
  type: "struct";
  struct: {
    structName: string;
    params: ParameterBase2;
  };
  default: T;
}

export interface StructWithName<T extends object = object>
  extends BaseStruct<T> {
  struct: {
    structName: string;
    params?: ParameterBase2;
  };
  default?: T;
}

export interface StructWithParams<T extends object = object>
  extends BaseStruct<T> {
  struct: {
    structName?: string;
    params: ParameterBase2;
  };
  default?: T;
}
export interface StructWithDefault<T extends object> extends BaseStruct<T> {
  default: T;
}

export interface StructArray<Array extends object[] = object[]>
  extends HasStruct2 {
  type: "struct[]";
  struct: StructBase2;
  default: Array;
}

export interface NodeItem_TypelessStruct<T extends object = object> {
  type: "struct";
  default: T;
}
export interface HasStruct2 {
  struct: StructBase2;
  default?: unknown;
}

interface NodeItem_Array<
  Array extends object[],
  KnowTypes extends object,
  Path extends string = "array?"
> extends HasStruct2 {
  type: "struct[]";
  struct: StructType2<Array[number], KnowTypes | Array[number], Path>;
  default: Array;
}
interface NodeItem_Struct<
  T extends object,
  KnowTypes extends object,
  Path extends string = "struct?"
> extends HasStruct2 {
  type: "struct";
  struct: StructType2<T, KnowTypes, Path>;
  default?: T;
}
