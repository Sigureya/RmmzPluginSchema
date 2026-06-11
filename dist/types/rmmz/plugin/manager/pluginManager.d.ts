export interface PluginManagerTemplate<PluginName extends string, CommandName extends string, CommandArgs extends object> {
    registerCommand: (name: PluginName, commandName: CommandName, args: CommandArgs) => void;
    callCommand(self: unknown, pluginName: PluginName, commandName: CommandName, args: CommandArgs): void;
}
