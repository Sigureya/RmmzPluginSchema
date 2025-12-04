import type {
  PluginArrayParamType,
  PluginParamEx,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayParamPathPairEx } from "./array";
import type { ValueCategory } from "./category";
import type { StructPathError } from "./errorTypes";

export interface StructPropertiesPath<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> {
  name: string;
  category: ValueCategory;
  scalarsPath: string | undefined;
  scalarArrays: ArrayParamPathPairEx<PluginParamEx<Array>>[];
  objectSchema: Record<string, Scalar>;
}

export interface TemplateG<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> {
  items: StructPropertiesPath<Scalar, Array>[];
}

export interface TemplateGE<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> {
  items: StructPropertiesPath<Scalar, Array>[];
  errors: StructPathError[];
}

export interface TemplateE<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> {
  scalars: StructPropertiesPath<Scalar, Array>;
  structs: TemplateGE<Scalar, Array>;
  structArrays: TemplateGE<Scalar, Array>;
}
