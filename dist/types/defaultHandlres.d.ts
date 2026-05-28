import { PluginCommandExtractErrorHandlers, CommandBuildErrorHandlers, ErrorStruct, PluginErrorStruct } from './features';
import { ParamBuildErrorHandlers } from './features/JSONPath/core/paramBuild';
export declare const defaultPluginCommandExtractErrorHandlers: PluginCommandExtractErrorHandlers;
export declare const defaultCommandBuildErrorHandlers: CommandBuildErrorHandlers<ErrorStruct>;
export declare const defaultPluginParamBuildErrorHandlers: ParamBuildErrorHandlers<PluginErrorStruct>;
