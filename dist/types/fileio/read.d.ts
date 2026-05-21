import { ResultOfparsePluginParamRecord } from '../rmmz/plugin';
import { PluginReadResult } from './convert';
import { MessageOfparsePluginParamRecordEx } from './types/msg';
export declare const readPluginInfosSafe: (messages: MessageOfparsePluginParamRecordEx, readPluginInfos: () => Promise<string>) => Promise<ResultOfparsePluginParamRecord>;
export declare const readAllPluginBodies: (recordsResult: ResultOfparsePluginParamRecord, messages: MessageOfparsePluginParamRecordEx, readPluginBody: (pluginName: string) => Promise<string>) => Promise<PluginReadResult>[];
