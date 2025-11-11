import type { PluginParamEx, ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { JSONPathJS } from "jsonpath-js";

export interface StructPropertysMemo {
  jsonPathJS: JSONPathJS;
  propetys: Record<string, PluginParamEx<ScalarParam>>;
}
