import type { PluginParam } from "@RmmzPluginSchema/rmmz/plugin";

export type ValueCategory2 =
  | "struct"
  | "command"
  | "param"
  | "args"
  | "primitive";

export interface PluginValues {
  rootType: ValueCategory2;
  roootName: string;
  value: number | string | boolean;
  category: ValueCategory2;
  name: string;
  param: PluginParam;
}
