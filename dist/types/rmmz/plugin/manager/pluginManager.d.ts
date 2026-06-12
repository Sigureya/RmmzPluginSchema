export interface PluginManagerTemplate<PluginName extends string, CommandName extends string, CommandArgs extends Record<string, unknown>> {
    registerCommand: (name: PluginName, commandName: CommandName, fn: (this: unknown, args: CommandArgs) => void) => void;
    callCommand(self: unknown, pluginName: PluginName, commandName: CommandName, args: CommandArgs): void;
}
