import type {
  ArrayParamTypes,
  ScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesPathBase } from "./base";
import type { ValueCategory } from "./category";
import type { StructPropertysPath, StructPathResultWithError } from "./struct";
import type { StructPropertysPathEx3 } from "./template";

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
  scalars?: StructPropertysPathEx3<Scalar, Array>;
  structs: StructPathResultWithError;
  structArrays: StructPathResultWithError;
}

export interface PrimitivePluginValuesPath<T extends ScalarParam>
  extends PluginValuesPathBase {
  rootCategory: "param" | "args";
  rootName: string;
  scalars: {
    category: "primitive";
    name: T["kind"];
    objectSchema: Record<string, T>;
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
