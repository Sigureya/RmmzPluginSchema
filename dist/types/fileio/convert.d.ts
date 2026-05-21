import { DeepJSONParserHandlers, ParsedPlugin, PluginParamsRecord } from '../rmmz/plugin';
import { ConvertPluginResult } from '../features';
import { MessageOfparsePluginParamRecordEx, PluginReadHandlers } from './types/msg';
export interface PluginReadResult {
    plugin: ParsedPlugin | null;
    error: string;
    record: PluginParamsRecord;
}
export declare const READ_PLUGIN_MESSAGES: MessageOfparsePluginParamRecordEx;
export declare const readPluginsWithSchema: (messages: MessageOfparsePluginParamRecordEx, handlers: PluginReadHandlers, parserHandlers: DeepJSONParserHandlers) => Promise<ConvertPluginResult[]>;
