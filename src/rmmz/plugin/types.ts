export interface Plugin {
  name: string;
  status: boolean;
  description: string;
  parameters: Record<string, string>;
}

export interface PluginInput {
  source: string;
  locale: string;
  pluginName: string;
}
