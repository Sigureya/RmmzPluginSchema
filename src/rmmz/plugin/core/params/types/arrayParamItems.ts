import type { ParamError } from "./error";
import type {
  PluginArrayParamType,
  PrimitiveParam,
  PluginScalarParam,
} from "./paramUnion";
import type { StructRefParam, StructArrayRefParam } from "./struct";

export interface PluginParam {
  name: string;
  attr: PrimitiveParam;
  errors?: ParamError[];
}

export interface PluginParamEx<
  T extends PrimitiveParam,
  N extends string = string,
> extends PluginParam {
  name: Extract<N, string>;
  attr: T;
  errors?: ParamError[];
}

export type PluginParamEx2<
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
  N extends string = string,
> = PluginParamEx<S | A | StructRefParam | StructArrayRefParam, N>;

export type StructPluginParam = PluginParamEx<
  StructRefParam | StructArrayRefParam
>;
