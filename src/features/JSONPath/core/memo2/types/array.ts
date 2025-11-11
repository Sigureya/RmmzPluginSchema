import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ArrayParamTypes,
  PluginParamEx,
  PrimitiveParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValues, ValueCategory2 } from "./result";

export interface PluginValuesSA extends PluginValues {
  value: string;
  category: ValueCategory2;
  name: string;
  param: PluginParamEx<StringArrayParam>;
}

export interface PluginValuesNA extends PluginValues {
  value: number;
  category: ValueCategory2;
  name: string;
  param: PluginParamEx<NumberArrayParam>;
}

type StringArrayParam = Extract<PrimitiveParam, { default: string[] }>;
type NumberArrayParam = Extract<PrimitiveParam, { default: number[] }>;

export interface ArrayPathMemo {
  jsonPathJS: JSONPathReader;
  schema: PluginParamEx<ArrayParamTypes>;
}
