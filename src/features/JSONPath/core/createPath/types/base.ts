import type {
  PluginArrayParamType,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ValueCategory } from "./category";
import type { StructPathNode, StructPathNodeList } from "./template";

export interface PluginValuesPathBase {
  rootCategory: ValueCategory;
  rootName: string;

  scalars?: StructPathNode<PluginScalarParam, PluginArrayParamType>;
  structs: StructPathNodeList<PluginScalarParam, PluginArrayParamType>;
  structArrays: StructPathNodeList<PluginScalarParam, PluginArrayParamType>;
}
