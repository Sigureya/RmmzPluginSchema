import { JSONPathReader } from '../../libs/jsonPath';
import { MessageOfparsePluginParamRecord } from '../../rmmz/plugin';
export interface MessageOfparsePluginParamRecordEx extends MessageOfparsePluginParamRecord {
    readErrorPluginsJS: string;
    readErrorPluginBody: string;
}
export interface PluginReadHandlers {
    readPluginInfos: () => Promise<string>;
    readPluginBody: (pluginName: string) => Promise<string>;
    jsonPath: (path: string) => JSONPathReader;
}
