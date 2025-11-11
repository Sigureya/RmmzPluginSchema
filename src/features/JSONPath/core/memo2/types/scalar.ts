import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginParamEx, ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValues, ValueCategory2 } from "./result";

export interface StructPropertysMemo {
  jsonPathJS: JSONPathReader;
  propetys: Record<string, ScalarParam>;
}

export interface PluginValueScalar extends PluginValues {
  value: number | string | boolean;
  category: ValueCategory2;
  name: string;
  param: PluginParamEx<ScalarParam>;
}
