import { MessageOfparsePluginParamRecord, ParsedPlugin, PluginParamsRecord } from '../../rmmz/plugin';
export interface MessageOfparsePluginParamRecordEx extends MessageOfparsePluginParamRecord {
    readErrorPluginsJS: string;
    readErrorPluginBody: string;
}
export interface PluginReadResult {
    plugin: ParsedPlugin | null;
    error: string;
    record: PluginParamsRecord;
}
