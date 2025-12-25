export interface PluginParamIgnore {
  pluginName: string;
  params: string[];
}

export interface PluginReadIgnore extends PluginParamIgnore {
  params: string[];
  commands: {
    commandName: string;
    args: string[];
  }[];
}
