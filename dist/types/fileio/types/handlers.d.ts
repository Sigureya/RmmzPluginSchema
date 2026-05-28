export interface PluginFileReader {
    readPluginList(): Promise<string>;
    readPluginBody(pluginName: string): Promise<string>;
}
