import type {
  PluginErrorStruct,
  BuildErrorHandlers,
  ErrorStruct,
  CommandExtractMessageHandlers,
  PluginExtractedValue,
  CommandArgExtractors,
} from "./features";
import type { ParamReadHandlers } from "./features/JSONPath/core/param2";
import type { ParamBuildErrorHandlers } from "./features/JSONPath/core/paramBuild";
import type { MessageOfparsePluginParamRecordEx } from "./fileio";
import type { JSONValue, JSONPathReader } from "./libs";
import type {
  ResultOfparsePluginParamRecord,
  ParsedPlugin,
  DeepJSONParserHandlers,
  PluginParamsRecord,
} from "./rmmz";

export interface PluginFileSystem {
  readPluginList(): Promise<string>;
  readPluginBody(pluginName: string): Promise<string>;
}

export interface PluginParser {
  parsePluginList: (
    source: string,
    msg: MessageOfparsePluginParamRecordEx,
  ) => ResultOfparsePluginParamRecord;
  parsePluginBody: (src: string) => ParsedPlugin;
  parseDeepRecord: (value: Record<string, string>) => Record<string, JSONValue>;
}

export interface PluginExtractAppHandlers<E> {
  parser: PluginParser;
  jsonPath: (path: string) => JSONPathReader;
  deepJSON: DeepJSONParserHandlers;
  paramBuild: ParamBuildErrorHandlers<PluginErrorStruct>;
  commandBuild: BuildErrorHandlers<ErrorStruct>;
  paramRead: ParamReadHandlers<E>;
  commandExtract: CommandExtractMessageHandlers;
}

export interface ExtractApplicationOptions {
  messages?: MessageOfparsePluginParamRecordEx;
}

export type ExtractErrorPhase =
  | "readPluginList"
  | "readPluginBody"
  | "parsePluginBody"
  | "buildParam"
  | "buildCommand"
  | "parseParam";

export interface ExtractAppError<E> {
  phase: ExtractErrorPhase;
  pluginName: string;
  message: string;
  detail?: unknown;
  errorInfo?: E;
}

export interface ExtractedPluginResult<E> {
  pluginName: string;
  record: PluginParamsRecord;
  params: PluginExtractedValue[];
  commandExtractors: CommandArgExtractors[];
  errors: ExtractAppError<E>[];
}

export interface ExtractApplicationResult<E> {
  status: "success" | "partial" | "failure";
  plugins: ExtractedPluginResult<E>[];
  allErrors: ExtractAppError<E>[];
}
