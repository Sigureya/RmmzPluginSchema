export interface ReplaceHandler2 {
  isReplaceTarget(path: string): boolean;
  findNewText(oldValue: string): string | undefined;
}

export interface TargetPath extends PluginParamPath {
  pluginName: string;
  paramsPath: string[][];
  commands: CommandXX[];
}

export interface PluginParamPath {
  pluginName: string;
  paramsPath: string[][];
}

export interface CommandXX {
  commandName: string;
  argsPath: string[][];
}
