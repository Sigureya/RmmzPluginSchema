import type { PluginCommandPathData, PluginReplacePathData } from "./features";
import type {
  MessageOfparsePluginParamRecordEx,
  PluginReadResult,
  PluginFileReader,
} from "./fileio";
import { READ_PLUGIN_MESSAGES } from "./fileio";
import type {
  PluginCommandData,
  PluginSchemaArray,
  ResultOfparsePluginParamRecord,
} from "./rmmz";
import type {
  PluginExtractionHandlers,
  PluginExtractionOptions,
} from "./types";

export interface Handler2<E> extends PluginExtractionHandlers<E> {
  isText: (text: string) => boolean;
}

const runPluginExtractionPipeline2 = async <E>(
  fs: PluginFileReader,
  handlers: PluginExtractionHandlers<E>,
  command: readonly PluginCommandData[],
  options: PluginExtractionOptions = {},
) => {
  const messages = options.messages ?? READ_PLUGIN_MESSAGES;

  const commandMap = Map.groupBy(command, (c): string => c.parameters[0]);
};

const joinX = (plugin: string, command: string) => {
  return `${plugin}:${command}`;
};

const ggrr = (pluginList: PluginReplacePathData[]) => {
  const map = createCommandMap2(pluginList);
};

const pluginCommanddRRR = (
  command: PluginCommandData,

  map: ReadonlyMap<string, PluginCommandPathData>,
) => {
  const key = joinX(command.parameters[0], command.parameters[1]);
  const commandPathData = map.get(key);
  if (!commandPathData) {
    return command;
  }
};

const createCommandMap2 = (
  pluginList: PluginReplacePathData[],
): Map<string, PluginCommandPathData> => {
  const items = pluginList.flatMap((plugin) =>
    plugin.commands.map((command): [string, PluginCommandPathData] => [
      joinX(plugin.pluginName, command.commandName),
      command,
    ]),
  );
  return new Map(items);
};
const ppxx = (
  plugin: PluginReplacePathData,
  commnands: readonly PluginCommandData[],
  fn: (text: string) => boolean,
) => {
  // まずstructを絞り込む
  //    createTextParamDictionary
};

const xxxx = (
  pluginTasks: Promise<PluginReadResult>[],
  commands: readonly PluginCommandData[],
) => {
  const commandMap = Map.groupBy(commands, (c): string => c.parameters[0]);
  pluginTasks.map(async (task) => {
    const result = await task;
  });
};

const ccc = (
  plugin: PluginReadResult,
  commands: readonly PluginCommandData[],
) => {};
