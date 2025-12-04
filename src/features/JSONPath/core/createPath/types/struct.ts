import type {
  PluginArrayParamType,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  TemplateE,
  TemplateG,
  StructPropertiesPath,
  TemplateGE,
} from "./template";

export type StructPropertysPath = StructPropertiesPath<
  PluginScalarParam,
  PluginArrayParamType
>;

export type StructPathResultWithError = TemplateGE<
  PluginScalarParam,
  PluginArrayParamType
>;

export type PluginValuesPathWithError = TemplateE<
  PluginScalarParam,
  PluginArrayParamType
>;

export type StructPathResultItems = TemplateG<
  PluginScalarParam,
  PluginArrayParamType
>;
