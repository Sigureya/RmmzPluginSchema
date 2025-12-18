import type {
  PluginParamEx,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValues } from "./result";

export type PluginValueScalar<T extends PluginScalarParam> = PluginValues<
  PluginParamEx<T>
>;
