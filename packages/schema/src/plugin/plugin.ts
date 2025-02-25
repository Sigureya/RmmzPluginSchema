import type { ParameterBase, StructParameters2 } from "./params";

export interface PluginBase {
  help: string;
  base: string[];
  orderAfter: string[];
  orderBefore: string[];
  params: ParameterBase;
}

export interface Plugin<Params extends object> extends PluginBase {
  params: StructParameters2<Params>;
}
