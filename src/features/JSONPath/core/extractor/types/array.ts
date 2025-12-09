import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginParamEx,
  PrimitiveParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValues, ValueCategory2 } from "./result";

export interface PluginValuesArrayExN<
  T extends NumberArrayParam = NumberArrayParam
> extends PluginValues {
  value: number;
  category: ValueCategory2;
  name: string;
  param: PluginParamEx<T>;
}

export interface PluginValuesArrayExS<T extends StringArrayParam>
  extends PluginValues {
  value: string;
  category: ValueCategory2;
  name: string;
  param: PluginParamEx<T>;
}

type StringArrayParam = Extract<PrimitiveParam, { default: string[] }>;
type NumberArrayParam = Extract<PrimitiveParam, { default: number[] }>;

export interface PluginArrayPathExtractor<
  T extends NumberArrayParam | StringArrayParam
> {
  jsonPathJS: JSONPathReader;
  schema: PluginParamEx<T>;
  parentType: string;
}

export interface PluginArrayPathExtractor2N<T extends NumberArrayParam> {
  jsonPathJS: JSONPathReader;
  schema: PluginParamEx<T>;
  parentType: string;
}

export interface PluginArrayPathExtractor2S<T extends StringArrayParam> {
  jsonPathJS: JSONPathReader;
  schema: PluginParamEx<T>;
  parentType: string;
}
