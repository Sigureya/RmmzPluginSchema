import type {
  PluginCommandPathData,
  PluginCommandPathMap,
  PluginReplacePathData,
} from "./types";

const ggg = (
  pluginList: ReadonlyArray<PluginReplacePathData>,
): PluginCommandPathMap => {
  return new Map(
    pluginList.flatMap((plugin) => createPluginCommandPath(plugin)),
  );
};

const createPluginCommandPath = (
  plugin: PluginReplacePathData,
): [string, Pick<PluginCommandPathData, "argsPath">][] => {
  return plugin.commands.map(
    (c): [string, Pick<PluginCommandPathData, "argsPath">] => {
      return [
        `${plugin.pluginName}:${c.commandName}`,
        { argsPath: c.argsPath },
      ];
    },
  );
};
