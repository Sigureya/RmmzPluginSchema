import { JSONPathReader } from '../../libs/jsonPath';
import { ParsedPlugin, ResultOfparsePluginParamRecord } from '../../rmmz/plugin';
import { MessageOfparsePluginParamRecordEx } from './msg';
export interface PluginReadHandlers {
    readPluginInfos: () => Promise<string>;
    readPluginBody: (pluginName: string) => Promise<string>;
    jsonPath: (path: string) => JSONPathReader;
    parsePluginBody: (src: string) => ParsedPlugin;
    parsePluginList: (source: string, msg: MessageOfparsePluginParamRecordEx) => ResultOfparsePluginParamRecord;
}
