import type {
  PluginParamEx,
  ArrayParamTypes,
  ScalaParam,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface StructPropertysPath {
  structName: string;
  scalas: string | undefined;
  scalaArrays: PathPair[];
  objectSchema: Record<string, ScalaParam>;
}

export interface PathPair {
  path: string;
  param: PluginParamEx<ArrayParamTypes>;
}

export interface StructPathError {
  path: string;
  code: string;
}

export interface StructPathResult {
  items: StructPropertysPath[];
  errors: StructPathError[];
}
