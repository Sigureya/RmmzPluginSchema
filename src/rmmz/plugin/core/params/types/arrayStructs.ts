import type { PluginParam } from "./arrayParamItems";
import type { PluginStructParamTypeEx } from "./pluginSchemaType";

export type PluginStructSchemaArray =
  PluginStructSchemaArrayFiltered<PluginParam>;

export interface PluginStructSchemaArrayFiltered<T extends PluginParam> {
  struct: string;
  params: T[];
}

export type PluginStructSchemaArrayEx<T> = {
  struct: string;
  params: PluginStructParamTypeEx<T>[];
};
