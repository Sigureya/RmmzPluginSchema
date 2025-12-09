import type {
  PluginArrayParamType,
  PrimitiveParam,
  PluginScalarParam,
  StringArrayUnion,
  NumberArrayUnion,
} from "./paramUnion";
import type { StructArrayRefParam, StructRefParam } from "./primitive";

interface PluginParamBase {
  name: string;
  attr: PrimitiveParam;
}

export interface PluginParam extends PluginParamBase {
  name: string;
  attr: PrimitiveParam;
}

export interface PluginParamEx<
  T extends PrimitiveParam,
  N extends string = string
> extends PluginParamBase {
  name: Extract<N, string>;
  attr: T;
}
export type PluginParamEx3<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion,
  N extends string = string
> = PluginParamEx<S | NA | SA | StructRefParam | StructArrayRefParam, N>;

export type PluginParamEx2<
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
  N extends string = string
> = PluginParamEx<S | A | StructRefParam | StructArrayRefParam, N>;

export type StructPluginParam = PluginParamEx<
  StructRefParam | StructArrayRefParam
>;
