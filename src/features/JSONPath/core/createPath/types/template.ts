import type {
  NumberArrayUnion,
  PluginArrayParamType,
  PluginParamEx,
  PluginScalarParam,
  StringArrayUnion,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayParamPathPair } from "./array";
import type { ValueCategory } from "./category";
import type { StructPathError } from "./errorTypes";

export interface StructPropertiesPath<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> {
  name: string;
  category: ValueCategory;
  scalarsPath: string | undefined;
  scalarArrays: ArrayParamPathPair<PluginParamEx<Array>>[];
  objectSchema: Record<string, Scalar>;
}

export interface StructPropertiesPathEx7<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> {
  name: string;
  category: ValueCategory;
  scalarsPath: string | undefined;
  scalarArrays: ArrayParamPathPair<PluginParamEx<Array>>[];
  objectSchema: Record<string, Scalar>;
}

/**
 * @deprecated use StructPropertiesPath instead
 */
export type StructPropertysPathEx3<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> = StructPropertiesPath<Scalar, Array>;

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

export interface TemplateGE7<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
> {
  items: StructPropertiesPath<S, NA | SA>[];
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
