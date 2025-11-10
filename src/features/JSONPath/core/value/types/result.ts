import type {
  ArrayParamTypes,
  PluginParam,
  PluginParamEx,
} from "@RpgTypes/rmmz/plugin";
import type { ValueCategory } from "./pathSchemaTypes";

export interface SequenceParamValuesBase {
  valueType: string;
  values: unknown[];
  param: PluginParamEx<ArrayParamTypes>;
}

export interface StringSequenceParamValues extends SequenceParamValuesBase {
  values: string[];
  valueType: "string";
  param: PluginParamEx<Extract<ArrayParamTypes, { default: string[] }>>;
}

export interface NumberSequenceParamValues extends SequenceParamValuesBase {
  values: number[];
  valueType: "number";
  param: PluginParamEx<Extract<ArrayParamTypes, { default: number[] }>>;
}

export interface PluginValues {
  value: number | string | boolean;
  category: ValueCategory;

  name: string;
  param: PluginParam;
}
