import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PathPair } from "./types";

export interface StructPropertysPath {
  structName: string;
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

export interface PluginValuesPath {
  scalars: StructPropertysPath;
  structs: StructPathResult;
  structArrays: StructPathResult;
}
