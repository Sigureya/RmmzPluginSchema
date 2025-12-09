import type {
  PluginArrayParamType,
  PluginParam,
  PluginParamEx2,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";

export type ValueCategory2 =
  | "struct"
  | "command"
  | "param"
  | "args"
  | "primitive";

export interface PluginValues<P extends PluginParam = PluginParam> {
  rootType: ValueCategory2;
  roootName: string;
  value: number | string | boolean;
  category: ValueCategory2;
  name: string;
  param: P;
}

export type PluginValues2<
  S extends PluginScalarParam,
  A extends PluginArrayParamType
> = PluginValues<PluginParamEx2<S, A>>;
