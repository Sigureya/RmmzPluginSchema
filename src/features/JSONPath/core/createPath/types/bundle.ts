import type {
  PluginArrayParamType,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesPathBase } from "./base";
import type {
  StructPropertysPathOld,
  StructPathResultWithError,
} from "./struct";
import type { StructPropertiesPath, TemplateGE } from "./template";

export interface PluginValuesPath extends PluginValuesPathBase {
  rootCategory: "param" | "args";
  rootName: string;
  scalars?: StructPropertysPathOld;
  structs: StructPathResultWithError;
  structArrays: StructPathResultWithError;
}

/**
 * @deprecated use PluginValuesPathSchema instead
 */
export type PluginValuesPathEx<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> = PluginValuesPathSchema<Scalar, Array>;

export interface PluginValuesPathSchema<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> extends PluginValuesPathBase {
  rootCategory: "param" | "args";
  rootName: string;
  scalars?: StructPropertiesPath<Scalar, Array>;
  structs: TemplateGE<Scalar, Array>;
  structArrays: TemplateGE<Scalar, Array>;
}

export interface PrimitivePluginValuesPath<T extends PluginScalarParam>
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
