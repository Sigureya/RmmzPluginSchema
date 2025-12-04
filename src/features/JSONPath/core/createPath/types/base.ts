import type { ValueCategory } from "./category";
import type { StructPropertysPathOld, StructPathResultItems } from "./struct";

export interface PluginValuesPathBase {
  rootCategory: ValueCategory;
  rootName: string;

  scalars?: StructPropertysPathOld;
  structs: StructPathResultItems;
  structArrays: StructPathResultItems;
}
