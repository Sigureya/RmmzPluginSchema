import type {
  PluginParamEx,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValues } from "./result";

export interface PluginValueScalar<T extends PluginScalarParam>
  extends PluginValues {
  value: number | string | boolean;
  structName: string;
  param: PluginParamEx<T>;
}
