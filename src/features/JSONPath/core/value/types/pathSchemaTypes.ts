import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PathPair } from "./types";

export interface StructPropertysPath {
  structName: string;
  scalars: string | undefined;
  scalarArrays: PathPair[];
  objectSchema: Record<string, ScalarParam>;
}

export interface StructPathError {
  path: string;
  code: string;
}

export interface StructPathResult {
  items: StructPropertysPath[];
  errors: StructPathError[];
}

export interface CommandPath {
  scalars: StructPropertysPath;
  structs: StructPathResult;
  structArrays: StructPathResult;
}
