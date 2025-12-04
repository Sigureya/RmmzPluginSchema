import type {
  PluginArrayParamType,
  PluginParamEx2,
  PluginSchemaArray,
  PluginSchemaArrayFiltered,
  PluginScalarParam,
} from "./params";
import type { PluginDependencies } from "./parse";

export interface PluginSchema {
  pluginName: string;
  target: string;
  meta: Record<string, string>;
  dependencies?: PluginDependencies;
  schema: PluginSchemaArray;
}

export interface PluginSchemaOf<
  S extends PluginScalarParam,
  A extends PluginArrayParamType
> extends PluginSchema {
  schema: PluginSchemaArrayFiltered<PluginParamEx2<S, A>>;
}
