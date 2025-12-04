import type {
  ArrayParamTypes,
  PrimitiveParam,
  ScalarParam,
} from "./paramUnion";
import type { StructArrayRefParam, StructRefParam } from "./primitive";

export interface PluginParam {
  name: string;
  attr: PrimitiveParam;
}

export interface PluginParamEx<
  T extends PrimitiveParam,
  N extends string = string
> {
  name: Extract<N, string>;
  attr: T;
}

export type PluginParamEx2<
  S extends ScalarParam,
  A extends ArrayParamTypes,
  N extends string = string
> = PluginParamEx<S | A | StructRefParam | StructArrayRefParam, N>;

export type StructPluginParam = PluginParamEx<
  StructRefParam | StructArrayRefParam
>;
