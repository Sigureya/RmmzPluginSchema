import { DeepJSONParserHandlers } from '../rmmz/plugin';
import { ConvertPluginResult } from '../features';
import { PluginReadHandlers } from './types/handlers';
import { MessageOfparsePluginParamRecordEx } from './types/msg';
export declare const READ_PLUGIN_MESSAGES: MessageOfparsePluginParamRecordEx;
export declare const readPluginsWithSchema: (messages: MessageOfparsePluginParamRecordEx, handlers: PluginReadHandlers, parserHandlers: DeepJSONParserHandlers) => Promise<ConvertPluginResult[]>;
