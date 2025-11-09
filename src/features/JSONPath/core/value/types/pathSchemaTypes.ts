import type { ScalaParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PathPair } from "./types";

export interface StructPropertysPath {
  structName: string;
  scalas: string | undefined;
  scalaArrays: PathPair[];
  objectSchema: Record<string, ScalaParam>;
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
