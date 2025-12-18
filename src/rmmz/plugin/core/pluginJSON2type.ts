import type {
  PluginArrayParamType,
  PluginParamEx2,
  PluginSchemaArray,
  PluginSchemaArrayFiltered,
  PluginScalarParam,
  PluginCommandSchemaArray,
  PluginStructSchemaArray,
} from "./params";
import type { PluginDependencies } from "./parse";

export interface PluginMinimumSchema {
  pluginName: string;
  schema: {
    commands: PluginCommandSchemaArray[];
    structs: PluginStructSchemaArray[];
  };
}

export interface PluginSchema extends PluginMinimumSchema {
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
