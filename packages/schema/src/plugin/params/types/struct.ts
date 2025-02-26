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
  | StructAnnotationBase_Union
  | StructAnnotationBase_Array;

export interface StructBase {
  structName: string;
  params: ParameterBase;
}

export interface ParameterBase extends Record<string, AnnotationTypes> {}

export interface HasStruct {
  struct: StructBase;
  default?: unknown;
}

export interface StructAnnotation<T extends object>
  extends NodeItem_StructWithType<T, "root", T> {}

export interface StructType<T extends object> extends StructBase {
  structName: string;
  params: StructParameters<T>;
}

export type StructParameters<T extends object> = StructParametersNode<
  T,
  T,
  "root"
>;

export type StructAnnotationBase_Union =
  | StructAnnotationBase_WithName
  | StructAnnotationBase_WithParams
  | StructAnnotationBase_WithDefault
  | StructAnnotationBase_WithType
  | StructAnnotationBase_Complete;

export interface StructAnnotationBase_Partial<T extends object = object>
  extends AnnotationBaseTexts {
  type: "struct";
  struct?: {
    structName?: string;
    params?: ParameterBase;
  };
  default?: T;
}

export interface StructAnnotationBase_Complete
  extends StructAnnotationBase_Partial {
  type: "struct";
  struct: StructBase;
  default: object;
}
export interface StructAnnotationBase_WithType
  extends StructAnnotationBase_Partial,
    HasStruct {
  struct: {
    structName: string;
    params: ParameterBase;
  };
  default?: object;
}

export interface StructAnnotationBase_WithName
  extends StructAnnotationBase_Partial {
  struct: {
    structName: string;
    params?: ParameterBase;
  };
  default?: object;
}

export interface StructAnnotationBase_WithParams
  extends StructAnnotationBase_Partial {
  struct: {
    structName?: string;
    params: ParameterBase;
  };
  default?: object;
}

export interface StructAnnotationBase_WithDefault
  extends StructAnnotationBase_Partial {
  default: object;
}

export interface StructAnnotationBase_Array extends HasStruct {
  type: "struct[]";
  struct: StructBase;
  default: object[];
}

type StructParametersNode<
  T extends object,
  KnowTypes extends object,
  Path extends string
> = {
  [Key in Extract<keyof T, string>]: ParamType<
    T[Key],
    T | KnowTypes,
    `${Path}.${Key}`
  >;
};

type ParamType<T, KnowTypes extends object, Path extends string> = T extends
  | number
  | string
  | boolean
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
  ? NodeItem_Union<T, Path, KnowTypes>
  : StructNode_Error<`never:${Path}`>;

interface NodeItem_Array<
  Array extends object[],
  KnowTypes extends object,
  Path extends string
> extends StructAnnotationBase_Array {
  type: "struct[]";
  default: Array;
  struct: {
    structName: string;
    params: StructParametersNode<
      Array[number],
      Array[number] | KnowTypes,
      `${Path}[]`
    >;
  };
}

type NodeItem_Union<
  T extends object,
  Path extends string,
  KnowTypes extends object
> =
  | NodeItem_StructWithType<T, Path, KnowTypes>
  | NodeItem_StructWithName<T, Path, KnowTypes>
  | NodeItem_StructWithDefault<T, Path, KnowTypes>
  | NodeItem_StructWithParams<T, Path, KnowTypes>;

interface NodeItem_StructWithType<
  T extends object,
  Path extends string,
  KnowTypes extends object
> extends StructAnnotationBase_WithType {
  type: "struct";
  struct: {
    structName: string;
    params: StructParametersNode<T, KnowTypes, Path>;
  };
  default?: T;
}

interface NodeItem_StructWithName<
  T extends object,
  Path extends string,
  KnowTypes extends object
> extends StructAnnotationBase_WithName {
  type: "struct";
  struct: {
    structName: string;
    param?: StructParametersNode<T, KnowTypes, Path>;
  };
  default?: T;
}

interface NodeItem_StructWithParams<
  T extends object,
  Path extends string,
  KnowTypes extends object
> extends StructAnnotationBase_WithParams {
  type: "struct";
  struct: {
    structName?: string;
    params: StructParametersNode<T, KnowTypes, Path>;
  };
  default?: T;
}

interface NodeItem_StructWithDefault<
  T extends object,
  Path extends string,
  KnowTypes extends object
> extends StructAnnotationBase_WithDefault {
  type: "struct";
  default: T;
  struct?: {
    structName?: string;
    params?: StructParametersNode<T, KnowTypes, Path>;
  };
}
