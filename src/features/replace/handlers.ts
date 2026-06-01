export interface ReplaceHandler2 {
  isReplaceTarget(path: string): boolean;
  findNewText(oldValue: string): string | undefined;
}

export interface TargetPath {
  pluginName: string;
  paramsPath: string[][];
  commands: CommandXX[];
}

export interface CommandXX {
  commandName: string;
  argsPath: string[][];
}
