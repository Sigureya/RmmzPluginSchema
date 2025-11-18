import type { ParamKinds, ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesPath2 } from "./base";
import type { ValueCategory } from "./category";
import type { StructPropertysPath, StructPathResultWithError } from "./struct";

export interface PluginValuesPathNewVersion extends PluginValuesPath2 {
  rootCategory: ValueCategory;
  rootName: string;
  scalars?: StructPropertysPath;
  structs: StructPathResultWithError;
  structArrays: StructPathResultWithError;
}

export interface PrimitivePluginValuesPath extends PluginValuesPath2 {
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
