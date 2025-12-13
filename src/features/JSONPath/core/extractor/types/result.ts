import type { PluginParam } from "@RmmzPluginSchema/rmmz/plugin";

export type ValueCategory2 =
  | "struct"
  | "command"
  | "param"
  | "args"
  | "primitive";

export type VCT_PS = "primitve" | "struct";
export type RootTypeCategory = "args" | "param";

export interface PluginValues<P extends PluginParam = PluginParam> {
  rootType: RootTypeCategory;
  roootName: string;
  value: number | string | boolean;
  category: ValueCategory2;
  name: string;
  param: P;
}
