import { JSONPathJS } from "jsonpath-js";
import { buildPluginValueExtractorV8 } from "./features";
import type {
  BuildErrorHandlers,
  CommandArgExtractors,
  CommandExtractMessageHandlers,
  EEBudnleV8,
  ErrorStruct,
  PluginErrorStruct,
  PluginExtractedValue,
} from "./features";
import { defaultCommandExtractHandlers } from "./features/JSONPath/core/command2";
import { defaultHandlers as defaultCommandBuildHandlers } from "./features/JSONPath/core/commandBuild";
import type {
  ParamReadHandlers,
  ParamReadResultV4,
} from "./features/JSONPath/core/param2";
import { extractPluginParamFromRecord4 } from "./features/JSONPath/core/param2";
import type { ParamBuildErrorHandlers } from "./features/JSONPath/core/paramBuild";
import { defaultParamBuildHandlers } from "./features/JSONPath/core/paramBuild";
import {
  READ_PLUGIN_MESSAGES,
  readAllPluginBodies,
  readPluginInfosSafe,
} from "./fileio";
import type {
  MessageOfparsePluginParamRecordEx,
  PluginReadResult,
} from "./fileio";
import type { JSONPathReader, JSONValue } from "./libs";
import {
  compilePluginAsArraySchema,
  parseDeepRecord,
  parsePluginByLocale,
  parsePluginParamRecord2,
} from "./rmmz";
import type {
  DeepJSONParserHandlers,
  ParsedPlugin,
  PluginParamsRecord,
  ResultOfparsePluginParamRecord,
} from "./rmmz";
import { createDeepJSONParserHandlers } from "./rmmz/plugin/core/deepJSONHandler";

export interface ExtractFileSystem {
  readPluginList(): Promise<string>;
  readPluginBody(pluginName: string): Promise<string>;
}

export interface ExtractAppHandlers<E> {
  parsePluginList: (
    source: string,
    msg: MessageOfparsePluginParamRecordEx,
  ) => ResultOfparsePluginParamRecord;
  parsePluginBody: (src: string) => ParsedPlugin;
  parseDeepRecord: (value: Record<string, string>) => Record<string, JSONValue>;
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
  | "parseParam"
  | "extractCommand";

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

export const createDefaultExtractAppHandlers = <E>(
  paramRead: ParamReadHandlers<E>,
): ExtractAppHandlers<E> => {
  return {
    parsePluginList: parsePluginParamRecord2,
    parsePluginBody: parsePluginByLocale,
    parseDeepRecord: parseDeepRecord,
    jsonPath: (path: string) => new JSONPathJS(path),
    deepJSON: createDeepJSONParserHandlers(),
    paramBuild: defaultParamBuildHandlers,
    commandBuild: defaultCommandBuildHandlers,
    paramRead,
    commandExtract: defaultCommandExtractHandlers,
  };
};

export const extractFromBasePath = async <E>(
  fs: ExtractFileSystem,
  handlers: ExtractAppHandlers<E>,
  options: ExtractApplicationOptions = {},
): Promise<ExtractApplicationResult<E>> => {
  const messages = options.messages ?? READ_PLUGIN_MESSAGES;
  const allErrors: ExtractAppError<E>[] = [];

  const pluginList = await readPluginInfosSafe(
    messages,
    () => fs.readPluginList(),
    handlers.parsePluginList,
  );
  if (!pluginList.complete || pluginList.invalidPlugins > 0) {
    allErrors.push({
      phase: "readPluginList",
      pluginName: "",
      message: pluginList.message,
      detail: {
        invalidPlugins: pluginList.invalidPlugins,
        complete: pluginList.complete,
      },
    });
  }

  const plugins = await Promise.all(
    readAllXXX(pluginList, messages, fs, handlers),
  );

  plugins.forEach((p) => allErrors.push(...p.errors));

  return {
    status: resolveStatus(plugins, allErrors),
    plugins,
    allErrors,
  };
};

const readAllXXX = <E>(
  pluginList: ResultOfparsePluginParamRecord,
  messages: MessageOfparsePluginParamRecordEx,
  fs: ExtractFileSystem,
  handlers: ExtractAppHandlers<E>,
): Promise<ExtractedPluginResult<E>>[] => {
  return readAllPluginBodies(
    pluginList,
    messages,
    (pluginName) => fs.readPluginBody(pluginName),
    handlers.parsePluginBody,
  ).map(async (task): Promise<ExtractedPluginResult<E>> => {
    return extractSinglePlugin(await task, handlers);
  });
};

const extractSinglePlugin = <E>(
  readResult: PluginReadResult,
  handlers: ExtractAppHandlers<E>,
): ExtractedPluginResult<E> => {
  const pluginName = readResult.record.name;

  if (readResult.plugin === null) {
    return {
      pluginName: readResult.record.name,
      record: readResult.record,
      params: [],
      commandExtractors: [],
      errors: readResult.error
        ? [
            {
              phase: "parsePluginBody",
              pluginName,
              message: "plugin body parse failed",
            },
          ]
        : [],
    };
  }

  const schema = compilePluginAsArraySchema(
    readResult.plugin,
    handlers.deepJSON,
  );
  const built = buildPluginValueExtractorV8(
    pluginName,
    schema,
    handlers.jsonPath,
    handlers.paramBuild,
    handlers.commandBuild,
  );

  const paramResult: ParamReadResultV4<E> = extractPluginParamFromRecord4(
    readResult.record,
    built.params.extractors,
    handlers.parseDeepRecord,
    handlers.paramRead,
  );

  return {
    pluginName,
    record: readResult.record,
    params: paramResult.params,
    commandExtractors: built.commands.extractors,
    errors: errorCCC(pluginName, built, paramResult),
  };
};

const errorCCC = <E>(
  pluginName: string,
  built: EEBudnleV8,
  p: ParamReadResultV4<E>,
): ExtractAppError<E>[] => {
  const errors: ExtractAppError<E>[] = [];
  errors.push(
    ...built.params.errors.map(
      (error): ExtractAppError<E> => ({
        phase: "buildParam",
        pluginName,
        message: error.message,
        detail: error,
      }),
    ),
  );
  errors.push(
    ...built.commands.errors.map(
      (error): ExtractAppError<E> => ({
        phase: "buildCommand",
        pluginName,
        message: error.message,
        detail: error,
      }),
    ),
  );
  if (p.errorKind === "parseError") {
    errors.push({
      phase: "parseParam",
      pluginName,
      message: "plugin parameter parse failed",
      errorInfo: p.errorInfo || undefined,
    });
  }
  return errors;
};

const resolveStatus = <E>(
  plugins: ReadonlyArray<ExtractedPluginResult<E>>,
  allErrors: ReadonlyArray<ExtractAppError<E>>,
): ExtractApplicationResult<E>["status"] => {
  if (allErrors.length === 0) {
    return "success";
  }
  if (plugins.some((plugin) => plugin.errors.length === 0)) {
    return "partial";
  }
  return "failure";
};
