import type {
  PrimitiveParam,
  PluginParamEx,
  PluginParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ValueCategory } from "../types";

export interface PluginValues {
  value: number | string | boolean;
  category: ValueCategory;

  name: string;
  param: PluginParam;
}

export interface PluginValuesSA extends PluginValues {
  value: string;
  category: ValueCategory;
  name: string;
  param: PluginParamEx<StringArrayParam>;
}

type StringArrayParam = Extract<PrimitiveParam, { default: string[] }>;
