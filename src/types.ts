import type {
  PluginErrorStruct,
  CommandBuildErrorHandlers,
  ErrorStruct,
  PluginCommandExtractErrorHandlers,
  PluginExtractedValue,
  CommandArgExtractors,
  ParamBuildErrorHandlers,
} from "./features";
import type { MessageOfparsePluginParamRecordEx } from "./fileio";
import type { JSONValue, JSONPathReader } from "./libs";
import type {
  ResultOfparsePluginParamRecord,
  ParsedPlugin,
  DeepJSONParserHandlers,
  PluginParamsRecord,
  PluginParamReadErrorHandlers,
  PluginSchemaArray,
} from "./rmmz";

export interface PluginParseHandlers {
  parsePluginList: (
    source: string,
    msg: MessageOfparsePluginParamRecordEx,
  ) => ResultOfparsePluginParamRecord;
  parsePluginBody: (src: string) => ParsedPlugin;
  parseDeepRecord: (value: Record<string, string>) => Record<string, JSONValue>;
}

export interface PluginExtractionHandlers<E> {
  parser: PluginParseHandlers;
  jsonPath: (path: string) => JSONPathReader;
  deepJSON: DeepJSONParserHandlers;
  paramBuild: ParamBuildErrorHandlers<PluginErrorStruct>;
  commandBuild: CommandBuildErrorHandlers<ErrorStruct>;
  paramRead: PluginParamReadErrorHandlers<E>;
  commandExtract: PluginCommandExtractErrorHandlers;
}

export interface PluginExtractionOptions {
  messages?: MessageOfparsePluginParamRecordEx;
}

export type PluginExtractionErrorPhase =
  | "readPluginList"
  | "readPluginBody"
  | "parsePluginBody"
  | "buildParam"
  | "buildCommand"
  | "parseParam";

export interface PluginExtractionError<E> {
  phase: PluginExtractionErrorPhase;
  pluginName: string;
  message: string;
  detail?: unknown;
  errorInfo?: E;
}

export interface PluginExtractionItemResult<E> {
  pluginName: string;
  schema: PluginSchemaArray;
  record: PluginParamsRecord;
  params: PluginExtractedValue[];
  commandExtractors: CommandArgExtractors[];
  errors: PluginExtractionError<E>[];
}

export interface PluginCommandExtractorSourceItem {
  commandExtractors: CommandArgExtractors[];
}

export interface PluginCommandExtractorSource {
  plugins: PluginCommandExtractorSourceItem[];
}

export interface PluginParamSourceItem {
  pluginName: string;
  params: PluginExtractedValue[];
}

export interface PluginParamSource {
  plugins: PluginParamSourceItem[];
}

export interface PluginParamSourceItemWithErrors<
  E,
> extends PluginParamSourceItem {
  errors: PluginExtractionError<E>[];
}

export interface PluginParamSourceWithErrors<E> {
  plugins: PluginParamSourceItemWithErrors<E>[];
}

export interface PluginExtractionResult<E>
  extends PluginCommandExtractorSource, PluginParamSourceWithErrors<E> {
  status: "success" | "partial" | "failure";
  plugins: PluginExtractionItemResult<E>[];
  allErrors: PluginExtractionError<E>[];
}
