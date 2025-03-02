import type { StructParameters, ParameterBase } from "./params";

export interface PluginCommandBase {
  commandName: string;
  desc?: string;
  text?: string;
  args: ParameterBase;
}

export interface PluginCommand<ArgType extends object>
  extends PluginCommandBase {
  args: StructParameters<ArgType>;
}
