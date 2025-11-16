import type {
  ArrayParamTypes,
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

export type ValueCategory = "struct" | "command" | "param";

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

export interface PluginValuesPathNewVersion {
  category: ValueCategory;
  name: string;
  scalars: StructPropertysPath;
  structs: StructPathResultWithError;
  structArrays: StructPathResultWithError;
}

export interface StructPathResult2 {
  items: StructPropertysPath[];
}

export interface PluginValuesPath2 {
  category: ValueCategory;
  name: string;

  scalars: StructPropertysPath;
  structs: StructPathResult2;
  structArrays: StructPathResult2;
}
