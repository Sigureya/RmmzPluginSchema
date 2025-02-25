import type { StructNode_Error } from "./errors";
import type {
  AnnotationBase,
  BooleanArg,
  Primitive,
  Primitive_Numbers,
  Primitive_NumbersArray,
  Primitive_Strings,
  Primitive_StringsArray,
  PrimitiveArray,
} from "./primitive";
import type { AnnotationPrimitiveTypes, AnnotationTypes } from "./struct";

interface StructRoot<T extends object> extends StructType2<T, T, "root"> {}

type StructUnion =
  | NodeItem_Array<object[], object, string>
  | NodeItem_Struct<object, object, string>
  | NodeItem_TypelessStruct<object>;

interface StructName {
  structName: string;
  params?: ParameterBase2;
}

export interface StructBase2 {
  structName: string;
  params: ParameterBase2;
}

interface ParameterBase2
  extends Record<
    string,
    AnnotationTypes | AnnotationPrimitiveTypes | StructUnion
  > {}

interface StructType2<
  T extends object,
  KnowTypes extends object,
  Path extends string = ""
> {
  structName: string;
  params: StructParameters2<T, KnowTypes, Path>;
}
type StructParameters2<
  T extends object,
  KnowTypes extends object,
  Path extends string = ""
> = {
  [Key in Extract<keyof T, string>]: ParamType2<
    T[Key],
    KnowTypes,
    `${Path}.${Key}`
  >;
};
export type AnnotationTypes2 =
  | BooleanArg
  | Primitive_Numbers
  | Primitive_NumbersArray
  | Primitive_Strings
  | Primitive_StringsArray
  | StructNode_Error;

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

interface HasStruct2 {
  struct: StructBase2;
  default?: unknown;
}
export interface NodeItem_Array<
  Array extends object[],
  KnowTypes extends object,
  Path extends string = "array?"
> extends HasStruct2 {
  type: "struct[]";
  struct: StructType2<Array[number], KnowTypes | Array[number], Path>;
  default: Array;
}

export interface NodeItem_Struct<
  T extends object,
  KnowTypes extends object,
  Path extends string = "struct?"
> extends HasStruct2 {
  type: "struct";
  struct: StructType2<T, KnowTypes, Path>;
  default?: T;
}

export type StructUnion2<T extends object> =
  | StructWithName<T>
  | StructWithParams<T>
  | StructWithDefault<T>;

export interface BaseStruct<T extends object>
  extends Omit<AnnotationBase, "default"> {
  type: "struct";
  struct?: {
    structName?: string;
    params?: ParameterBase2;
  };
  default?: T;
}

export interface StructComplete<T extends object> extends BaseStruct<T> {
  type: "struct";
  struct: {
    structName: string;
    params: ParameterBase2;
  };
  default: T;
}

interface StructWithName<T extends object> extends BaseStruct<T> {
  struct: {
    structName: string;
    params?: ParameterBase2;
  };
  default?: T;
}

export interface StructWithParams<T extends object> extends BaseStruct<T> {
  struct: {
    structName?: string;
    params: ParameterBase2;
  };
  default?: T;
}
interface StructWithDefault<T extends object> extends BaseStruct<T> {
  default: T;
}

export interface NodeItem_TypelessStruct<T extends object = object> {
  type: "struct";
  default: T;
}

interface Parson {
  name: string;
  age: number;
}
interface Home {
  name: string;
  address: {
    street: string;
    city: string;
  };
  family: Parson[];
}

const pp: StructRoot<Parson> = {
  structName: "Parson",

  params: {
    name: {
      type: "string",
      default: "John",
    },
    age: {
      type: "number",
      default: 30,
    },
  },
};

const xx: StructRoot<Home> = {
  structName: "Home",

  params: {
    name: {
      type: "string",
      default: "John",
    },
    family: {
      type: "struct[]",
      struct: {
        structName: "Parson",
        params: {
          name: {
            type: "string",
            default: "John",
          },
          age: {
            type: "number",
            default: 30,
          },
        },
      },
      default: [],
    },
    address: {
      type: "struct",
      struct: {
        structName: "Address",
        params: {
          street: {
            type: "string",
            default: "sss",
          },
          city: {
            type: "string",
            default: "ccc",
          },
        },
      },
    },
  },
};
