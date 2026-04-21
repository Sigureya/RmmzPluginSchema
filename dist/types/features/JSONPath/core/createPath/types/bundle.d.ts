import { PluginArrayParamType, PluginScalarParam } from '../../../../../rmmz/plugin';
import { PluginValuesPathBase } from './base';
import { StructPathNode, StructPathNodeListWithErrors } from './template';
export interface PluginValuesPath extends PluginValuesPathBase {
    rootCategory: "param" | "args";
    rootName: string;
    scalars?: StructPathNode<PluginScalarParam, PluginArrayParamType>;
    structs: StructPathNodeListWithErrors<PluginScalarParam, PluginArrayParamType>;
    structArrays: StructPathNodeListWithErrors<PluginScalarParam, PluginArrayParamType>;
}
export interface PluginValuesPathSchema<Scalar extends PluginScalarParam, Array extends PluginArrayParamType> extends PluginValuesPathBase {
    rootCategory: "param" | "args";
    rootName: string;
    scalars?: StructPathNode<Scalar, Array>;
    structs: StructPathNodeListWithErrors<Scalar, Array>;
    structArrays: StructPathNodeListWithErrors<Scalar, Array>;
}
export interface PrimitivePluginValuesPath<T extends PluginScalarParam> extends PluginValuesPathBase {
    rootCategory: "param" | "args";
    rootName: string;
    scalars: {
        name: T["kind"];
        objectSchema: Record<string, T>;
        scalarsPath: `$["${string}"]${string}`;
        scalarArrays: [];
    };
    structs: {
        items: [];
        errors: [];
    };
    structArrays: {
        items: [];
        errors: [];
    };
}
