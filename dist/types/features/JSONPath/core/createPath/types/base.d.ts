import { ValueCategory } from './category';
import { StructPropertysPath, StructPathResultItems } from './struct';
export interface PluginValuesPathBase {
    rootCategory: ValueCategory;
    rootName: string;
    scalars?: StructPropertysPath;
    structs: StructPathResultItems;
    structArrays: StructPathResultItems;
}
