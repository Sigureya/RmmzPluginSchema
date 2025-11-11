import type { ArrayParamTypes, PluginParamEx } from "@RpgTypes/rmmz/plugin";

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
