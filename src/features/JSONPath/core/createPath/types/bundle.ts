import type {
  ArrayParamTypes,
  ParamKinds,
  ScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesPathBase } from "./base";
import type { ValueCategory } from "./category";
import type { StructPropertysPath, StructPathResultWithError } from "./struct";
import type { TemplateXXX } from "./template";

export interface PluginValuesPath extends PluginValuesPathBase {
  rootCategory: ValueCategory;
  rootName: string;
  scalars?: StructPropertysPath;
  structs: StructPathResultWithError;
  structArrays: StructPathResultWithError;
}

export interface PluginValuesPathEx<
  Scalar extends ScalarParam,
  Array extends ArrayParamTypes
> extends PluginValuesPathBase {
  rootCategory: ValueCategory;
  rootName: string;
  scalars?: TemplateXXX<Scalar, Array>;
  structs: StructPathResultWithError;
  structArrays: StructPathResultWithError;
}

export interface PrimitivePluginValuesPath extends PluginValuesPathBase {
  rootCategory: "param" | "args";
  rootName: string;
  scalars: {
    category: "primitive";
    name: ParamKinds;
    objectSchema: Record<string, ScalarParam>;
    scalarsPath: `$.${string}`;
    scalarArrays: [];
  };
  structs: {
    items: [];
    errors: [];
  };
  structArrays: {
    items: [];
    errors: [];
  };
}
