import { ParameterBase2, StructParameters2 } from './params';
export interface PluginBase {
    help: string;
    base: string[];
    orderAfter: string[];
    orderBefore: string[];
    params: ParameterBase2;
}
export interface Plugin<Params extends object> extends PluginBase {
    params: StructParameters2<Params>;
}
