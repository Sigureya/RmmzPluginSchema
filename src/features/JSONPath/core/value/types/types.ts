import type {
  PluginParamEx,
  ArrayParamTypes,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface PathPair {
  path: string;
  param: PluginParamEx<ArrayParamTypes>;
}
