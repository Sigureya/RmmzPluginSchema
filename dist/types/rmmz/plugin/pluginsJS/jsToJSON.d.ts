import { PluginParamsRecord } from './types';
import { MessageOfparsePluginParamRecord, ResultOfparsePluginParamRecord } from './types/result2';
export declare const convertPluginsJSToJSON: (src: string) => string[];
export declare const parsePluginParamRecord: (src: string) => PluginParamsRecord[];
export declare const parsePluginParamRecord2: (src: string, msg: MessageOfparsePluginParamRecord) => ResultOfparsePluginParamRecord;
