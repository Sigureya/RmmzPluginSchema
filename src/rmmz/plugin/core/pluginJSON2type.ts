import type { PluginSchemaArray } from "./params";
import type { PluginDependencies } from "./parse";

export interface PluginSchemaV2 {
  pluginName: string;
  target: string;
  meta: Record<string, string>;
  dependencies?: PluginDependencies;
  schema: PluginSchemaArray;
}
