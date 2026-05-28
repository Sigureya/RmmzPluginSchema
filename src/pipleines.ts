import { JSONPathJS } from "jsonpath-js";
import {
  defaultCommandBuildErrorHandlers,
  defaultPluginCommandExtractErrorHandlers,
  defaultPluginParamBuildErrorHandlers,
} from "./defaultHandlres";
import { buildPluginValueExtractor } from "./features";
import type { PluginExtractionBuildBundle } from "./features";
import type {
  PluginParamReadErrorHandlers,
  ParamReadResult,
} from "./features/JSONPath/core/param";
import { extractPluginParamFromRecord } from "./features/JSONPath/core/param";
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
import type { PluginSchemaArray, ResultOfparsePluginParamRecord } from "./rmmz";
import { createDeepJSONParserHandlers } from "./rmmz/plugin/core/deepJSONHandler";
import type {
  PluginExtractionHandlers,
  PluginFileReader,
  PluginExtractionOptions,
  PluginExtractionResult,
  PluginExtractionError,
  PluginExtractionItemResult,
} from "./types";

export const createDefaultPluginExtractionHandlers = <E>(
  paramRead: PluginParamReadErrorHandlers<E>,
): PluginExtractionHandlers<E> => {
  return {
    parser: {
      parsePluginList: (source, msg) => parsePluginParamRecord2(source, msg),
      parsePluginBody: (src) => parsePluginByLocale(src),
      parseDeepRecord: (value) => parseDeepRecord(value),
    },
    jsonPath: (path: string) => new JSONPathJS(path),
    deepJSON: createDeepJSONParserHandlers(),
    paramBuild: defaultPluginParamBuildErrorHandlers,
    commandBuild: defaultCommandBuildErrorHandlers,
    paramRead,
    commandExtract: defaultPluginCommandExtractErrorHandlers,
  };
};

export const runPluginExtractionPipeline = async <E>(
  fs: PluginFileReader,
  handlers: PluginExtractionHandlers<E>,
  options: PluginExtractionOptions = {},
): Promise<PluginExtractionResult<E>> => {
  const messages = options.messages ?? READ_PLUGIN_MESSAGES;
  const pluginList = await readPluginInfosSafe(
    messages,
    () => fs.readPluginList(),
    (source, msg) => handlers.parser.parsePluginList(source, msg),
  );

  const plugins = await Promise.all(
    readAndExtractAllPlugin(pluginList, messages, fs, handlers),
  );
  const allErrors = mergePluginExtractionErrors(pluginList, plugins);
  return {
    status: resolveStatus(plugins, allErrors),
    plugins: plugins,
    allErrors: allErrors,
  };
};

const mergePluginExtractionErrors = <T>(
  pluginList: ResultOfparsePluginParamRecord,
  plugins: readonly PluginExtractionItemResult<T>[],
): PluginExtractionError<T>[] => {
  if (!pluginList.complete || pluginList.invalidPlugins > 0) {
    const pluginListError: PluginExtractionError<T> = {
      phase: "readPluginList",
      pluginName: "",
      message: pluginList.message,
      detail: {
        invalidPlugins: pluginList.invalidPlugins,
        complete: pluginList.complete,
      },
    };
    return [pluginListError, ...normalizePluginErrors(plugins)];
  }
  return normalizePluginErrors(plugins);
};

const normalizePluginErrors = <T>(
  list: readonly PluginExtractionItemResult<T>[],
): PluginExtractionError<T>[] => {
  return list.flatMap((item) => {
    return item.errors.map((error) => ({
      ...error,
      pluginName: item.pluginName,
    }));
  });
};

const readAndExtractAllPlugin = <E>(
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
  ).map(async (readTask): Promise<PluginExtractionItemResult<E>> => {
    return extractSinglePlugin(await readTask, handlers);
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

  const schema: PluginSchemaArray = compilePluginAsArraySchema(
    readResult.plugin,
    handlers.deepJSON,
  );
  const extractionBuildBundle: PluginExtractionBuildBundle =
    buildPluginValueExtractor(
      pluginName,
      schema,
      handlers.jsonPath,
      handlers.paramBuild,
      handlers.commandBuild,
    );

  const paramResult: ParamReadResult<E> = extractPluginParamFromRecord(
    readResult.record,
    extractionBuildBundle.params.extractors,
    handlers.parser.parseDeepRecord,
    handlers.paramRead,
  );

  return {
    pluginName,
    record: readResult.record,
    params: paramResult.params,
    commandExtractors: extractionBuildBundle.commands.extractors,
    errors: buildPluginExtractionErrors(
      pluginName,
      extractionBuildBundle,
      paramResult,
    ),
  };
};

const buildPluginExtractionErrors = <E>(
  pluginName: string,
  built: PluginExtractionBuildBundle,
  paramReadResult: ParamReadResult<E>,
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
  if (paramReadResult.errorKind === "parseError") {
    errors.push({
      phase: "parseParam",
      pluginName,
      message: "plugin parameter parse failed",
      errorInfo: paramReadResult.errorInfo || undefined,
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
