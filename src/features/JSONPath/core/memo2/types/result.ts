import type { PluginParam } from "@RmmzPluginSchema/rmmz/plugin";

export type ValueCategory2 = "struct" | "command" | "param";

export interface PluginValues {
  value: number | string | boolean;
  category: ValueCategory2;
  name: string;
  param: PluginParam;
}
