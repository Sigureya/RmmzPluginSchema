import { ArrayParamTypes, ScalarParam } from '../../../../../rmmz/plugin';
import { PluginValuesPathBase } from './base';
import { ValueCategory } from './category';
import { StructPropertysPath, StructPathResultWithError } from './struct';
import { StructPropertysPathEx3 } from './template';
export interface PluginValuesPath extends PluginValuesPathBase {
    rootCategory: ValueCategory;
    rootName: string;
    scalars?: StructPropertysPath;
    structs: StructPathResultWithError;
    structArrays: StructPathResultWithError;
}
export interface PluginValuesPathEx<Scalar extends ScalarParam, Array extends ArrayParamTypes> extends PluginValuesPathBase {
    rootCategory: ValueCategory;
    rootName: string;
    scalars?: StructPropertysPathEx3<Scalar, Array>;
    structs: StructPathResultWithError;
    structArrays: StructPathResultWithError;
}
export interface PrimitivePluginValuesPath<T extends ScalarParam> extends PluginValuesPathBase {
    rootCategory: "param" | "args";
    rootName: string;
    scalars: {
        category: "primitive";
        name: T["kind"];
        objectSchema: Record<string, T>;
        scalarsPath: `$.${string}`;
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
