import type {
  PluginParamEx,
  PluginArrayParamType,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface ArrayParamPathPair {
  path: `${string}[*]`;
  param: PluginParamEx<PluginArrayParamType>;
}

export interface ArrayParamPathPairEx<
  T extends PluginParamEx<PluginArrayParamType>
> {
  path: `${string}[*]`;
  param: T;
}
