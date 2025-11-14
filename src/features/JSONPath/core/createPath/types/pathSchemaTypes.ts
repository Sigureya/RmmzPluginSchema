import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PathPair } from "./types";

export interface StructPropertysPath {
  name: string;
  category: ValueCategory;
  scalars: string | undefined;
  scalarArrays: PathPair[];
  objectSchema: Record<string, ScalarParam>;
}

export type ValueCategory = "struct" | "command" | "param";

export interface StructPathError {
  path: string;
  code: string;
}

export interface StructPathResult {
  items: StructPropertysPath[];
  errors: StructPathError[];
}

export interface PluginValuesPathWithError {
  scalars: StructPropertysPath;
  structs: StructPathResult;
  structArrays: StructPathResult;
}

export interface PluginValuesPathNewVersion {
  scalars: StructPropertysPath;
  structs: StructPathResult;
  structArrays: StructPathResult;
}

export interface StructPathResult2 {
  items: StructPropertysPath[];
}

export interface PluginValuesPath2 {
  scalars: StructPropertysPath;
  structs: StructPathResult2;
  structArrays: StructPathResult2;
}
