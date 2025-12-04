import type {
  PluginParamEx,
  PluginArrayParamType,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface ArrayParamPathPair<
  T extends PluginParamEx<PluginArrayParamType> = PluginParamEx<PluginArrayParamType>
> {
  path: `${string}[*]`;
  param: T;
}
