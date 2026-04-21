export * from './core';
export * from './pluginsJS';
export type { ClassifiedPluginParams, ClassifiedPluginParamsEx, } from './core/params/types/classifyTypes';
export type { DeepJSONParserHandlers } from './core/deepJSONHandler';
export { parsePlugin, parsePluginByLocale } from './core/parse';
export { pluginSourceToArraySchema, pluginSourceToJSON } from './plugin';
