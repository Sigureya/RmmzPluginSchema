export interface PluginCommandData {
  code: 357;
  indent: number;
  parameters: [
    pluginName: string,
    commandName: string,
    title: string,
    args: Record<string, string>,
  ];
}
