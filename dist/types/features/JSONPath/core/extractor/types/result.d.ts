import { PluginParam } from '../../../../../rmmz/plugin';
export type RootTypeCategory = "args" | "param";
export type PluginValues<P extends PluginParam = PluginParam> = PluginValuesS<P> | PluginValuesN<P> | PluginValuesB;
export interface PluginValuesS<P extends PluginParam = PluginParam> {
    rootType: RootTypeCategory;
    rootName: string;
    value: string;
    structName: string;
    param: P;
}
export interface PluginValuesN<P extends PluginParam = PluginParam> {
    rootType: RootTypeCategory;
    rootName: string;
    value: number;
    structName: string;
    param: P;
}
export interface PluginValuesB {
    rootType: RootTypeCategory;
    rootName: string;
    value: boolean;
    structName: string;
    param: PluginParam;
}
