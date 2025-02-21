import type { ParameterBase, Parameter } from "./plugin/params";

export interface PluginBase {
  help: string;
  base: string[];
  orderAfter: string[];
  orderBefore: string[];
  params: ParameterBase;
}

export interface PluginParam<Params extends object> extends PluginBase {
  params: Parameter<Params>;
}
