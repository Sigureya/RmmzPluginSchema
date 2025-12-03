import type {
  PluginParamEx,
  ArrayParamTypes,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface ArrayParamPathPair {
  path: `${string}[*]`;
  param: PluginParamEx<ArrayParamTypes>;
}

export interface ArrayParamPathPairEx<
  T extends PluginParamEx<ArrayParamTypes>
> {
  path: `${string}[*]`;
  param: T;
}
