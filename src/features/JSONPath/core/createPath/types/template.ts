import type {
  PluginArrayParamType,
  PluginParamEx,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayParamPathPair } from "./array";
import type { ValueCategory } from "./category";
import type { StructPathError } from "./errorTypes";

export interface StructPathNode<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType,
> {
  name: string;
  category?: ValueCategory;
  scalarsPath: string | undefined;
  scalarArrays: ArrayParamPathPair<PluginParamEx<Array>>[];
  objectSchema: Record<string, Scalar>;
}

export interface StructPathNodeList<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType,
> {
  items: StructPathNode<Scalar, Array>[];
}

export interface StructPathNodeListWithErrors<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType,
> {
  items: StructPathNode<Scalar, Array>[];
  errors: StructPathError[];
}

export interface PluginPathTemplateSections<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType,
> {
  scalars: StructPathNode<Scalar, Array>;
  structs: StructPathNodeListWithErrors<Scalar, Array>;
  structArrays: StructPathNodeListWithErrors<Scalar, Array>;
}
