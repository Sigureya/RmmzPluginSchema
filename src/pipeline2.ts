import type {
  MessageOfparsePluginParamRecordEx,
  PluginReadResult,
} from "./fileio";
import { READ_PLUGIN_MESSAGES, type PluginFileReader } from "./fileio";
import type { PluginCommandData, ResultOfparsePluginParamRecord } from "./rmmz";
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
