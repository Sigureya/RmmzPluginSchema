import type {
  NumberArrayParam,
  NumberArrayUnion,
  PluginArrayParamType,
  PluginScalarParam,
  StringArrayParam,
  StringArrayUnion,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesPathBase } from "./base";
import type { ValueCategory } from "./category";
import type { StructPropertiesPath, TemplateGE } from "./template";

export type PluginValuesPathOld = PluginValuesPathSchema7<
  PluginScalarParam,
  NumberArrayParam,
  StringArrayParam
>;

/**
 * @deprecated use PluginValuesPathSchema instead
 */
export type PluginValuesPathEx<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> = PluginValuesPathSchema<Scalar, Array>;

/**
 * @deprecated use PluginValuesPathSchema7 instead
 */
export interface PluginValuesPathSchema<
  Scalar extends PluginScalarParam,
  Array extends PluginArrayParamType
> extends PluginValuesPathBase {
  rootCategory: ValueCategory;
  rootName: string;
  scalars?: StructPropertiesPath<Scalar, Array>;
  structs: TemplateGE<Scalar, Array>;
  structArrays: TemplateGE<Scalar, Array>;
}

export interface PluginValuesPathSchema7<
  Scalar extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
> extends PluginValuesPathBase {
  rootCategory: ValueCategory;
  rootName: string;
  scalars?: StructPropertiesPath<Scalar, NA | SA>;
  structs: TemplateGE<Scalar, NA | SA>;
  structArrays: TemplateGE<Scalar, NA | SA>;
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
