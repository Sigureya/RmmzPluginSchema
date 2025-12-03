import type { PluginParamEx, ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValues, ValueCategory2 } from "./result";

export interface PluginValueScalar<T extends ScalarParam> extends PluginValues {
  value: number | string | boolean;
  category: ValueCategory2;
  name: string;
  param: PluginParamEx<T>;
}
