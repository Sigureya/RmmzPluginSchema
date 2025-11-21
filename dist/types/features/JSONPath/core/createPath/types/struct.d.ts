import { ScalarParam } from '../../../../../rmmz/plugin';
import { ArrayParamPathPair } from './array';
import { ValueCategory } from './category';
import { StructPathError } from './errorTypes';
export interface StructPropertysPath {
    name: string;
    category: ValueCategory;
    scalarsPath: string | undefined;
    scalarArrays: ArrayParamPathPair[];
    objectSchema: Record<string, ScalarParam>;
}
export interface StructPathResultWithError {
    items: StructPropertysPath[];
    errors: StructPathError[];
}
export interface PluginValuesPathWithError {
    scalars: StructPropertysPath;
    structs: StructPathResultWithError;
    structArrays: StructPathResultWithError;
}
export interface StructPathResultItems {
    items: StructPropertysPath[];
}
