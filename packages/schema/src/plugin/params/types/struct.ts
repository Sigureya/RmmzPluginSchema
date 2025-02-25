import type { StructNode_Error } from "./errors";
import type {
  AnnotationBaseTexts,
  Primitive,
  PrimitiveArray,
  AnnotationPrimitiveTypes,
} from "./primitive";
export interface StructBase {
  structName: string;
  params: ParameterBase;
}
export interface ParameterBase
  extends Record<
    string,
    AnnotationTypes | AnnotationPrimitiveTypes | StructUnion
  > {}

export interface Struct<T extends object>
  extends NodeItem_Struct<T, T, "root"> {}

type StructUnion =
  | NodeItem_Array<object[], object, string>
  | NodeItem_Struct<object, object, string>
  | NodeItem_TypelessStruct<object>;

interface StructType<
  T extends object,
  KnowTypes extends object,
  Path extends string = ""
> {
  structName: string;
  params: StructParametersNode<T, KnowTypes, Path>;
}

export type StructParameters<T extends object> = StructParametersNode<
  T,
  T,
  "root"
>;
type StructParametersNode<
  T extends object,
  KnowTypes extends object,
  Path extends string
> = {
  [Key in Extract<keyof T, string>]: ParamType<
    T[Key],
    KnowTypes,
    `${Path}.${Key}`
  >;
};

export type AnnotationTypes =
  | AnnotationPrimitiveTypes
  | StructNode_Error
  | StructUnion;

type ParamType<
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
    params?: ParameterBase;
  };
  default?: T;
}

export interface StructComplete<T extends object = object>
  extends BaseStruct<T> {
  type: "struct";
  struct: {
    structName: string;
    params: ParameterBase;
  };
  default: T;
}

export interface StructWithName<T extends object = object>
  extends BaseStruct<T> {
  struct: {
    structName: string;
    params?: ParameterBase;
  };
  default?: T;
}

export interface StructWithParams<T extends object = object>
  extends BaseStruct<T> {
  struct: {
    structName?: string;
    params: ParameterBase;
  };
  default?: T;
}
export interface StructWithDefault<T extends object> extends BaseStruct<T> {
  default: T;
}

export interface StructArray<Array extends object[] = object[]>
  extends HasStruct {
  type: "struct[]";
  struct: StructBase;
  default: Array;
}

export interface NodeItem_TypelessStruct<T extends object = object> {
  type: "struct";
  default: T;
}
export interface HasStruct {
  struct: StructBase;
  default?: unknown;
}

interface NodeItem_Array<
  Array extends object[],
  KnowTypes extends object,
  Path extends string = "array?"
> extends HasStruct {
  type: "struct[]";
  struct: StructType<Array[number], KnowTypes | Array[number], Path>;
  default: Array;
}
interface NodeItem_Struct<
  T extends object,
  KnowTypes extends object,
  Path extends string = "struct?"
> extends HasStruct {
  type: "struct";
  struct: StructType<T, KnowTypes, Path>;
  default?: T;
}
