import type { PluginParam } from "@RmmzPluginSchema/rmmz/plugin";

export type RootTypeCategory = "args" | "param";

export type PluginExtractedValue<P extends PluginParam = PluginParam> =
  | PluginStringValue<P>
  | PluginNumberValue<P>
  | PluginBooleanValue;

/**
 * @deprecated Use `PluginValuesS`, `PluginValuesN`, or `PluginValuesB` instead, depending on the expected value type.
 */
export type PluginValues<P extends PluginParam = PluginParam> =
  PluginExtractedValue<P>;

/**
 * @deprecated Use `PluginValuesS` instead, which is specifically designed for string values and provides clearer semantics.
 */
export type PluginValuesS<P extends PluginParam = PluginParam> =
  PluginStringValue<P>;

export interface PluginStringValue<P extends PluginParam = PluginParam> {
  rootType: RootTypeCategory;
  rootName: string;
  value: string;
  structName: string;
  param: P;
}

/**
 * @deprecated Use `PluginValuesN`, which is specifically designed for number values and provides clearer semantics.
 */
export type PluginValuesN<P extends PluginParam = PluginParam> =
  PluginNumberValue<P>;

export interface PluginNumberValue<P extends PluginParam = PluginParam> {
  rootType: RootTypeCategory;
  rootName: string;
  value: number;
  structName: string;
  param: P;
}

export interface PluginBooleanValue {
  rootType: RootTypeCategory;
  rootName: string;
  value: boolean;
  structName: string;
  param: PluginParam;
}

/**
 * @deprecated Use `PluginValuesB`, which is specifically designed for boolean values and provides clearer semantics.
 */
export type PluginValuesB = PluginBooleanValue;
