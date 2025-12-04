import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginArrayParamType,
  PluginParamEx,
  PrimitiveParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValues, ValueCategory2 } from "./result";

export interface PluginValuesStringArray extends PluginValues {
  value: string;
  category: ValueCategory2;
  name: string;
  param: PluginParamEx<StringArrayParam>;
}

export interface PluginValuesNumberArray<
  T extends NumberArrayParam = NumberArrayParam
> extends PluginValues {
  value: number;
  category: ValueCategory2;
  name: string;
  param: PluginParamEx<T>;
}

type StringArrayParam = Extract<PrimitiveParam, { default: string[] }>;
type NumberArrayParam = Extract<PrimitiveParam, { default: number[] }>;

export interface PluginArrayPathExtractor<T extends PluginArrayParamType> {
  jsonPathJS: JSONPathReader;
  schema: PluginParamEx<T>;
  parentType: string;
}
