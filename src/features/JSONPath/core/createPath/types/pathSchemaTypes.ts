import type {
  ArrayParamTypes,
  ParamKinds,
  PluginParamEx,
  ScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface ArrayParamPathPair {
  path: `${string}[*]`;
  param: PluginParamEx<ArrayParamTypes>;
}

export interface StructPropertysPath {
  name: string;
  category: ValueCategory;
  scalarsPath: string | undefined;
  scalarArrays: ArrayParamPathPair[];
  objectSchema: Record<string, ScalarParam>;
}

export type ValueCategory =
  | "struct"
  | "command"
  | "param"
  | "args"
  | "primitive";

export interface StructPathError {
  path: string;
  code: string;
}

export interface StructPathResultWithError {
  items: StructPropertysPath[];
  errors: StructPathError[];
}

export interface PluginValuesPathWithError {
  scalars: StructPropertysPath;
  structs: StructPathResultWithError;
  structArrays: StructPathResultWithError;
}

export interface PluginValuesPathNewVersion extends PluginValuesPath2 {
  rootCategory: ValueCategory;
  rootName: string;
  scalars: StructPropertysPath;
  structs: StructPathResultWithError;
  structArrays: StructPathResultWithError;
}

export interface PrimitivePluginValuesPath extends PluginValuesPath2 {
  rootCategory: "param" | "args";
  rootName: string;
  scalars: {
    category: "primitive";
    name: ParamKinds;
    objectSchema: Record<string, ScalarParam>;
    scalarsPath: `$.${string}`;
    scalarArrays: [];
  };
  structs: {
    items: [];
    errors: [];
  };
  structArrays: {
    items: [];
    errors: [];
  };
}

export interface StructPathResult2 {
  items: StructPropertysPath[];
}

export interface PluginValuesPath2 {
  rootCategory: ValueCategory;
  rootName: string;

  scalars: StructPropertysPath;
  structs: StructPathResult2;
  structArrays: StructPathResult2;
}
