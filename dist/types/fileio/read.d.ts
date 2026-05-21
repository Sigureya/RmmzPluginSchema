import { ParsedPlugin, ResultOfparsePluginParamRecord } from '../rmmz/plugin';
import { MessageOfparsePluginParamRecordEx, PluginReadResult } from './types/msg';
export declare const readPluginInfosSafe: (messages: MessageOfparsePluginParamRecordEx, readPluginInfos: () => Promise<string>, parsePluginList: (source: string, msg: MessageOfparsePluginParamRecordEx) => ResultOfparsePluginParamRecord) => Promise<ResultOfparsePluginParamRecord>;
export declare const readAllPluginBodies: (recordsResult: ResultOfparsePluginParamRecord, messages: MessageOfparsePluginParamRecordEx, readPluginBody: (pluginName: string) => Promise<string>, parsePluginBody: (src: string) => ParsedPlugin) => Promise<PluginReadResult>[];
