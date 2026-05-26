import { DeepJSONParserHandlers } from '../rmmz/plugin';
import { CommandMapKey, CommandArgExtractors, ConvertPluginResult } from '../features';
import { PluginReadHandlers } from './types/handlers';
import { MessageOfparsePluginParamRecordEx } from './types/msg';
export declare const READ_PLUGIN_MESSAGES: MessageOfparsePluginParamRecordEx;
export declare const buildCommandMapFromFiles: (messages: MessageOfparsePluginParamRecordEx, handlers: PluginReadHandlers, parserHandlers: DeepJSONParserHandlers) => Promise<Map<CommandMapKey, CommandArgExtractors>>;
export declare const readPluginsWithSchema: (messages: MessageOfparsePluginParamRecordEx, handlers: PluginReadHandlers, parserHandlers: DeepJSONParserHandlers) => Promise<ConvertPluginResult[]>;
