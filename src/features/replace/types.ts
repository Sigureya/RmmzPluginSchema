export interface PluginReplacePath extends PluginParamPath {
  pluginName: string;
  paramsPath: string[][];
  commands: PluginCommandPath[];
}

export interface PluginParamPath {
  pluginName: string;
  paramsPath: string[][];
}

export interface PluginCommandPath {
  commandName: string;
  argsPath: string[][];
}
