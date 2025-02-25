import type { StructNode_Error } from "./errors";
import type {
  AnnotationBaseTexts,
  Primitive,
  PrimitiveArray,
  AnnotationPrimitiveTypes,
} from "./primitive";

export type AnnotationTypes =
  | AnnotationPrimitiveTypes
  | StructNode_Error
  | StructUnion
  | StructArray;

export interface StructBase {
  structName: string;
  params: ParameterBase;
}
export interface ParameterBase extends Record<string, AnnotationTypes> {}

export interface HasStruct {
  struct: StructBase;
  default?: unknown;
}

export interface Struct<T extends object>
  extends NodeItem_Struct<T, T, "root"> {}

export type StructUnion<T extends object = object> =
  | StructWithName<T>
  | StructWithParams<T>
  | StructWithDefault<T>
  | StructWithType<T>
  | StructComplete<T>;

export interface StructInterface<T extends object> extends AnnotationBaseTexts {
  type: "struct";
  struct?: {
    structName?: string;
    params?: ParameterBase;
  };
  default?: T;
}

export interface StructComplete<T extends object = object>
  extends StructInterface<T> {
  type: "struct";
  struct: {
    structName: string;
    params: ParameterBase;
  };
  default: T;
}

export interface StructWithDefault<T extends object>
  extends StructInterface<T> {
  default: T;
}

export interface StructWithName<T extends object = object>
  extends StructInterface<T> {
  struct: {
    structName: string;
    params?: ParameterBase;
  };
  default?: T;
}

export interface StructWithParams<T extends object = object>
  extends StructInterface<T> {
  struct: {
    structName?: string;
    params: ParameterBase;
  };
  default?: T;
}

export interface StructWithType<T extends object = object>
  extends StructInterface<T>,
    HasStruct {
  struct: {
    structName: string;
    params: ParameterBase;
  };
  default?: T;
}

export interface StructArray<Array extends object[] = object[]>
  extends HasStruct {
  type: "struct[]";
  struct: StructBase;
  default: Array;
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
  ? NodeItem_Struct<T, KnowTypes, Path> | StructWithDefault<T>
  : StructNode_Error<`never:${Path}`>;

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

interface StructType<
  T extends object,
  KnowTypes extends object,
  Path extends string
> {
  structName: string;
  params: StructParametersNode<T, KnowTypes, Path>;
}
