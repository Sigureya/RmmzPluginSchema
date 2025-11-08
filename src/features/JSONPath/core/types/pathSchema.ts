import type {
  PrimitiveParam,
  PluginParamEx,
  ArrayParamTypes,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface StructPropertysPath {
  structName: string;
  scalas: string | undefined;
  scalaArrays: PathPair[];
  objectSchema: Record<string, PrimitiveParam>;
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
