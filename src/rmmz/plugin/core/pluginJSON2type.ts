import type {
  ArrayParamTypes,
  PluginParamEx2,
  PluginSchemaArray,
  PluginSchemaArrayFiltered,
  ScalarParam,
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
  S extends ScalarParam,
  A extends ArrayParamTypes
> extends PluginSchema {
  schema: PluginSchemaArrayFiltered<PluginParamEx2<S, A>>;
}
