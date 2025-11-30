import type { ParamKinds, ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesPathBase } from "./base";
import type { ValueCategory } from "./category";
import type { StructPropertysPath, StructPathResultWithError } from "./struct";

export interface PluginValuesPath extends PluginValuesPathBase {
  rootCategory: ValueCategory;
  rootName: string;
  scalars?: StructPropertysPath;
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
