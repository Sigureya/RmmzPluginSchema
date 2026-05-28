import { JSONPathJS } from "jsonpath-js";
import { buildPluginValueExtractorV8 } from "./features";
import type {
  BuildErrorHandlers,
  CommandArgExtractors,
  CommandExtractMessageHandlers,
  CommandExtractResult,
  CommandMapKey,
  ErrorStruct,
  PluginErrorStruct,
  PluginExtractedValue,
} from "./features";
import {
  defaultCommandExtractHandlers,
  extractArgsFromPluginCommandHandled,
} from "./features/JSONPath/core/command2";
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
  PluginCommandData,
  PluginParamsRecord,
  ResultOfparsePluginParamRecord,
} from "./rmmz";
import { createDeepJSONParserHandlers } from "./rmmz/plugin/core/deepJSONHandler";

export interface ExtractFileSystem {
  readFile(path: string): Promise<string>;
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
  commands?: ReadonlyArray<PluginCommandData>;
}

export type ExtractErrorPhase =
  | "readPluginList"
  | "readPluginBody"
  | "parsePluginBody"
  | "buildParam"
  | "buildCommand"
  | "parseParam"
  | "extractCommand";

export interface ExtractAppError<E = unknown> {
  phase: ExtractErrorPhase;
  pluginName: string;
  message: string;
  detail?: unknown;
  errorInfo?: E;
}

export interface ExtractedPluginResult<E = unknown> {
  pluginName: string;
  record: PluginParamsRecord;
  params: PluginExtractedValue[];
  commandExtractors: CommandArgExtractors[];
  commandResults: CommandExtractResult[];
  errors: ExtractAppError<E>[];
}

export interface ExtractApplicationResult<E = unknown> {
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
  basePath: string,
  fs: ExtractFileSystem,
  handlers: ExtractAppHandlers<E>,
  options: ExtractApplicationOptions = {},
): Promise<ExtractApplicationResult<E>> => {
  const messages = options.messages ?? READ_PLUGIN_MESSAGES;
  const commands = options.commands ?? [];
  const allErrors: ExtractAppError<E>[] = [];

  const pluginList = await readPluginInfosSafe(
    messages,
    () => fs.readFile(resolvePluginsListPath(basePath)),
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

  const readTasks = readAllPluginBodies(
    pluginList,
    messages,
    (pluginName) => fs.readFile(resolvePluginBodyPath(basePath, pluginName)),
    handlers.parsePluginBody,
  );
  const readResults = await Promise.all(readTasks);

  const plugins = readResults.map((readResult) => {
    return extractSinglePlugin(readResult, handlers, commands);
  });

  plugins.forEach((p) => allErrors.push(...p.errors));

  return {
    status: resolveStatus(plugins, allErrors),
    plugins,
    allErrors,
  };
};

const extractSinglePlugin = <E>(
  readResult: PluginReadResult,
  handlers: ExtractAppHandlers<E>,
  commands: ReadonlyArray<PluginCommandData>,
): ExtractedPluginResult<E> => {
  const pluginName = readResult.record.name;
  const errors: ExtractAppError<E>[] = [];

  //   if (readResult.error) {
  //     errors.push({
  //       phase: "readPluginBody",
  //       pluginName,
  //       message: readResult.error,
  //     });
  //   }

  if (readResult.plugin === null) {
    // if (!readResult.error) {
    //   errors.push({
    //     phase: "parsePluginBody",
    //     pluginName,
    //     message: "plugin body parse failed",
    //   });
    // }
    return {
      pluginName,
      record: readResult.record,
      params: [],
      commandExtractors: [],
      commandResults: [],
      errors,
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

  //   errors.push(
  //     ...built.params.errors.map(
  //       (error): ExtractAppError<E> => ({
  //         phase: "buildParam",
  //         pluginName,
  //         message: error.message,
  //         detail: error,
  //       }),
  //     ),
  //   );
  //   errors.push(
  //     ...built.commands.errors.map(
  //       (error): ExtractAppError<E> => ({
  //         phase: "buildCommand",
  //         pluginName,
  //         message: error.message,
  //         detail: error,
  //       }),
  //     ),
  //   );

  const paramResult: ParamReadResultV4<E> = extractPluginParamFromRecord4(
    readResult.record,
    built.params.extractors,
    handlers.parseDeepRecord,
    handlers.paramRead,
  );
  //   if (paramResult.errorKind === "parseError") {
  //     errors.push({
  //       phase: "parseParam",
  //       pluginName,
  //       message: "plugin parameter parse failed",
  //       errorInfo: paramResult.errorInfo ?? undefined,
  //     });
  //   }

  const commandMap = toCommandMap(built.commands.extractors);
  const commandResults = commands
    .filter((command) => command.parameters[0] === pluginName)
    .map((command) =>
      extractArgsFromPluginCommandHandled(
        command,
        commandMap,
        handlers.commandExtract,
        handlers.parseDeepRecord,
      ),
    );

  //   commandResults.forEach((result) => {
  //     if (result.error) {
  //       errors.push({
  //         phase: "extractCommand",
  //         pluginName,
  //         message: result.error.message,
  //         detail: result.error,
  //       });
  //     }
  //   });

  return {
    pluginName,
    record: readResult.record,
    params: paramResult.params,
    commandExtractors: built.commands.extractors,
    commandResults,
    errors,
  };
};

const normalizeBasePath = (basePath: string): string => {
  return basePath.replace(/[\\/]+$/u, "");
};

const resolvePluginsListPath = (basePath: string): string => {
  return `${normalizeBasePath(basePath)}/js/plugins.js`;
};

const resolvePluginBodyPath = (
  basePath: string,
  pluginName: string,
): string => {
  return `${normalizeBasePath(basePath)}/js/plugins/${pluginName}.js`;
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

const toCommandMap = (
  extractors: ReadonlyArray<CommandArgExtractors>,
): ReadonlyMap<CommandMapKey, CommandArgExtractors> => {
  const entries = extractors.map((extractor) => {
    const key: CommandMapKey = `${extractor.pluginName}:${extractor.commandName}`;
    return [key, extractor] as const;
  });
  return new Map(entries);
};
