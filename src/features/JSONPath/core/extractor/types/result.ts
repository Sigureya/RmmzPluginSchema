import type { PluginParam } from "@RmmzPluginSchema/rmmz/plugin";

export type RootTypeCategory = "args" | "param";

export interface PluginValues<P extends PluginParam = PluginParam> {
  rootType: RootTypeCategory;
  rootName: string;
  value: number | string | boolean;
  structName: string;
  param: P;
}
