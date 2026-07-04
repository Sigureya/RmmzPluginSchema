import type {
  PluginArrayParamType,
  PluginParamEx2,
  PluginSchemaArray,
  PluginSchemaArrayFiltered,
  PluginScalarParam,
  PluginCommandSchemaArray,
  PluginStructSchemaArray,
  PluginParam,
} from "./params";
import type { PluginDependencies } from "./parse";

export interface PluginCommandMinimumSchemaOld {
  pluginName: string;
  schema: {
    commands: PluginCommandSchemaArray[];
    structs: PluginStructSchemaArray[];
  };
}

export interface PluginCommandMinimumSchema {
  pluginName: string;
  schema: {
    commands: PluginCommandSchemaArray[];
    structs: PluginStructSchemaArray[];
    params: PluginParam[];
  };
}

export interface PluginMetaKeywords {
  author?: string;
  plugindesc?: string;
  url?: string;
}

export interface PluginSchema extends PluginCommandMinimumSchema {
  locale: string;
  pluginName: string;
  target: string;
  meta: PluginMetaKeywords;
  dependencies: PluginDependencies;
  schema: PluginSchemaArray;
}

export interface PluginSchemaOf<
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
> extends PluginCommandMinimumSchema {
  schema: PluginSchemaArrayFiltered<PluginParamEx2<S, A>>;
}
