import type {
  PluginParamEx,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginExtractedValue } from "./result";

export type PluginValueScalar<T extends PluginScalarParam> =
  PluginExtractedValue<PluginParamEx<T>>;
