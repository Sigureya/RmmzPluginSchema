import type {
  PluginParam,
  PluginParamEx,
  PrimitiveParam,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface PluginValuesSA extends PluginValues {
  value: string;
  category: ValueCategory2;
  name: string;
  param: PluginParamEx<StringArrayParam>;
}

type StringArrayParam = Extract<PrimitiveParam, { default: string[] }>;
export type ValueCategory2 = "struct" | "command" | "param";

export interface PluginValues {
  value: number | string | boolean;
  category: ValueCategory2;

  name: string;
  param: PluginParam;
}
