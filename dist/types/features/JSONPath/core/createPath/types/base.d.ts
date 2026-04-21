import { PluginArrayParamType, PluginScalarParam } from '../../../../../rmmz/plugin';
import { ValueCategory } from './category';
import { StructPathNode, StructPathNodeList } from './template';
export interface PluginValuesPathBase {
    rootCategory: ValueCategory;
    rootName: string;
    scalars?: StructPathNode<PluginScalarParam, PluginArrayParamType>;
    structs: StructPathNodeList<PluginScalarParam, PluginArrayParamType>;
    structArrays: StructPathNodeList<PluginScalarParam, PluginArrayParamType>;
}
