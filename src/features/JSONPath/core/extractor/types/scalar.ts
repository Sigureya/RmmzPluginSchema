import type {
  PluginParamEx,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValues, ValueCategory2 } from "./result";

export interface PluginValueScalar<T extends PluginScalarParam>
  extends PluginValues {
  value: number | string | boolean;
  category: ValueCategory2;
  name: string;
  param: PluginParamEx<T>;
}
