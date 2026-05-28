import { JSONPathReader } from '../../libs/jsonPath';
import { PluginCommandData, PluginSchemaArray, ClassifiedPluginParams, PluginCommandSchemaArray, PluginParam } from '../../rmmz/plugin';
import { CommandBuildErrorHandlers, CommandArgExtractors, CommandBuildResult, PluginCommandExtractErrorHandlers, CommandExtractorEntryList, CommandExtractResult, CommandMapKey, PluginExtractionBuildBundle, ErrorStruct, ParamBuildResult, PluginErrorStruct } from './core';
import { ParamBuildErrorHandlers } from './core/paramBuild';
/**
 * @deprecated pipelines 起点の現行フローでは未使用です。
 */
export declare const mergeCommandMap: (list: ReadonlyArray<CommandExtractorEntryList>) => Map<CommandMapKey, CommandArgExtractors>;
type CommandBuildResultE = CommandBuildResult<ErrorStruct>;
/**
 * @deprecated pipelines 起点の現行フローでは未使用です。`extractPluginCommandWithExtractor` を利用してください。
 */
export declare const extractArgsFromPluiginCommand: (command: PluginCommandData, map: ReadonlyMap<CommandMapKey, CommandArgExtractors>, handlers: PluginCommandExtractErrorHandlers) => CommandExtractResult;
export declare const buildPluginValueExtractor: (pluginName: string, schema: PluginSchemaArray, factoryFn: (path: string) => JSONPathReader, paramErrorHandlers: ParamBuildErrorHandlers<PluginErrorStruct>, commandErrorHandlers: CommandBuildErrorHandlers<ErrorStruct>) => PluginExtractionBuildBundle;
export declare const buildCommandExtractors: (pluginName: string, commands: ReadonlyArray<PluginCommandSchemaArray>, structMap: ReadonlyMap<string, ClassifiedPluginParams>, factoryFn: (path: string) => JSONPathReader, handlers: CommandBuildErrorHandlers<ErrorStruct>) => CommandBuildResultE;
export declare const buildParamExtractors: (pluginName: string, params: ReadonlyArray<PluginParam>, structMap: ReadonlyMap<string, ClassifiedPluginParams>, factoryFn: (path: string) => JSONPathReader, handlers: ParamBuildErrorHandlers<PluginErrorStruct>) => ParamBuildResult;
export {};
