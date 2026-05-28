import { PluginParamReadErrorHandlers } from './features/JSONPath/core/param';
import { PluginFileReader } from './fileio';
import { PluginExtractionHandlers, PluginExtractionOptions, PluginExtractionResult } from './types';
export declare const createDefaultPluginExtractionHandlers: <E>(paramRead: PluginParamReadErrorHandlers<E>) => PluginExtractionHandlers<E>;
export declare const runPluginExtractionPipeline: <E>(fs: PluginFileReader, handlers: PluginExtractionHandlers<E>, options?: PluginExtractionOptions) => Promise<PluginExtractionResult<E>>;
