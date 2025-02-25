import type { StructParameters2, ParameterBase2 } from "./params";

export interface PluginCommandBase {
  commandName: string;
  desc?: string;
  text?: string;
  args: ParameterBase2;
}

export interface PluginCommand<ArgType extends object>
  extends PluginCommandBase {
  args: StructParameters2<ArgType>;
}
