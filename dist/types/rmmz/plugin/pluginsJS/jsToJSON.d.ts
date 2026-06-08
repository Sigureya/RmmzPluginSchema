import { PluginParamsRecord } from './types';
import { MessageOfparsePluginParamRecord, ResultOfparsePluginParamRecord } from './types/result2';
export declare const convertPluginsJSToJSON: (src: string) => string[];
/**
 * @deprecated Use parsePluginParamRecord instead. This function is only exported for testing purposes and may be removed in the future.
 */
export declare const parsePluginParamRecord2: (src: string, msg: MessageOfparsePluginParamRecord) => ResultOfparsePluginParamRecord;
export declare const parsePluginParamRecord: (src: string, msg: MessageOfparsePluginParamRecord) => ResultOfparsePluginParamRecord;
/**
 * Converts pre-validated plugin records into RPG Maker MZ plugins.js format.
 */
export declare const stringifyPluginsJS: (records: readonly PluginParamsRecord[]) => string;
