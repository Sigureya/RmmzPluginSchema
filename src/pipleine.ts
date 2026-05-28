import { JSONPathJS } from "jsonpath-js";
import { buildPluginValueExtractorV8 } from "./features";
import type { EEBudnleV8 } from "./features";
import { defaultCommandExtractHandlers } from "./features/JSONPath/core/command2";
import { defaultHandlers as defaultCommandBuildHandlers } from "./features/JSONPath/core/commandBuild";
import type {
  ParamReadHandlers,
  ParamReadResultV4,
} from "./features/JSONPath/core/param2";
import { extractPluginParamFromRecord4 } from "./features/JSONPath/core/param2";
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
import {
  compilePluginAsArraySchema,
  parseDeepRecord,
  parsePluginByLocale,
  parsePluginParamRecord2,
} from "./rmmz";
import type { ResultOfparsePluginParamRecord } from "./rmmz";
import { createDeepJSONParserHandlers } from "./rmmz/plugin/core/deepJSONHandler";
import type {
  PluginExtractionHandlers,
  PluginFileReader,
  PluginExtractionOptions,
  PluginExtractionResult,
  PluginExtractionError,
  PluginExtractionItemResult,
} from "./types";

export const createDefaultExtractAppHandlers = <E>(
  paramRead: ParamReadHandlers<E>,
): PluginExtractionHandlers<E> => {
  return {
    parser: {
      parsePluginList: (source, msg) => parsePluginParamRecord2(source, msg),
      parsePluginBody: (src) => parsePluginByLocale(src),
      parseDeepRecord: (value) => parseDeepRecord(value),
    },
    jsonPath: (path: string) => new JSONPathJS(path),
    deepJSON: createDeepJSONParserHandlers(),
    paramBuild: defaultParamBuildHandlers,
    commandBuild: defaultCommandBuildHandlers,
    paramRead,
    commandExtract: defaultCommandExtractHandlers,
  };
};

export const extractFromBasePath = async <E>(
  fs: PluginFileReader,
  handlers: PluginExtractionHandlers<E>,
  options: PluginExtractionOptions = {},
): Promise<PluginExtractionResult<E>> => {
  const messages = options.messages ?? READ_PLUGIN_MESSAGES;
  const allErrors: PluginExtractionError<E>[] = [];

  const pluginList = await readPluginInfosSafe(
    messages,
    () => fs.readPluginList(),
    (source, msg) => handlers.parser.parsePluginList(source, msg),
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
  fs: PluginFileReader,
  handlers: PluginExtractionHandlers<E>,
): Promise<PluginExtractionItemResult<E>>[] => {
  return readAllPluginBodies(
    pluginList,
    messages,
    (pluginName: string) => fs.readPluginBody(pluginName),
    (src: string) => handlers.parser.parsePluginBody(src),
  ).map(async (task): Promise<PluginExtractionItemResult<E>> => {
    return extractSinglePlugin(await task, handlers);
  });
};

const extractSinglePlugin = <E>(
  readResult: PluginReadResult,
  handlers: PluginExtractionHandlers<E>,
): PluginExtractionItemResult<E> => {
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
    handlers.parser.parseDeepRecord,
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
): PluginExtractionError<E>[] => {
  const errors: PluginExtractionError<E>[] = [];
  errors.push(
    ...built.params.errors.map(
      (error): PluginExtractionError<E> => ({
        phase: "buildParam",
        pluginName,
        message: error.message,
        detail: error,
      }),
    ),
  );
  errors.push(
    ...built.commands.errors.map(
      (error): PluginExtractionError<E> => ({
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
  plugins: ReadonlyArray<PluginExtractionItemResult<E>>,
  allErrors: ReadonlyArray<PluginExtractionError<E>>,
): PluginExtractionResult<E>["status"] => {
  if (allErrors.length === 0) {
    return "success";
  }
  if (plugins.some((plugin) => plugin.errors.length === 0)) {
    return "partial";
  }
  return "failure";
};
