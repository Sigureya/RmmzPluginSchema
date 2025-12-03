import type {
  ArrayParamTypes,
  PluginParamEx,
  ScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayParamPathPairEx } from "./array";
import type { ValueCategory } from "./category";
import type { StructPathError } from "./errorTypes";

export interface StructPropertysPathEx3<
  Scalar extends ScalarParam,
  Array extends ArrayParamTypes
> {
  name: string;
  category: ValueCategory;
  scalarsPath: string | undefined;
  scalarArrays: ArrayParamPathPairEx<PluginParamEx<Array>>[];
  objectSchema: Record<string, Scalar>;
}

export interface TemplateG<
  Scalar extends ScalarParam,
  Array extends ArrayParamTypes
> {
  items: StructPropertysPathEx3<Scalar, Array>[];
}

export interface TemplateGE<
  Scalar extends ScalarParam,
  Array extends ArrayParamTypes
> {
  items: StructPropertysPathEx3<Scalar, Array>[];
  errors: StructPathError[];
}

export interface TemplateE<
  Scalar extends ScalarParam,
  Array extends ArrayParamTypes
> {
  scalars: StructPropertysPathEx3<Scalar, Array>;
  structs: TemplateGE<Scalar, Array>;
  structArrays: TemplateGE<Scalar, Array>;
}
