import { PluginParam } from '../../../../../rmmz/plugin';
export type Vct_PS = "primitve" | "struct";
export type RootTypeCategory = "args" | "param";
export interface PluginValues<P extends PluginParam = PluginParam> {
    rootType: RootTypeCategory;
    roootName: string;
    value: number | string | boolean;
    structName: string;
    param: P;
}
