import type {
  ArrayParamTypes,
  ScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { StructPathError } from "./errorTypes";
import type { TemplateE, TemplateG, StructPropertysPathEx3 } from "./template";

export type StructPropertysPath = StructPropertysPathEx3<
  ScalarParam,
  ArrayParamTypes
>;

export interface StructPathResultWithError {
  items: StructPropertysPath[];
  errors: StructPathError[];
}

export type PluginValuesPathWithError = TemplateE<ScalarParam, ArrayParamTypes>;

export type StructPathResultItems = TemplateG<ScalarParam, ArrayParamTypes>;
