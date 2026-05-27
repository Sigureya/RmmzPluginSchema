import type { PluginReadResult } from "@RmmzPluginSchema/fileio/types";
import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginScalarParam,
  PluginArrayParamType,
  PluginSchemaOf,
  PluginParamsRecord,
  PluginCommandData,
  PluginSchemaArray,
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
  PluginParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  createClassifiedStructMap,
  compilePluginAsArraySchema,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  BuildErrorHandlers,
  CommandArgExtractors,
  CommandBuildResult,
  CommandExtractMessageHandlers,
  CommandExtractorEntry,
  CommandExtractorEntryList,
  CommandExtractResult,
  CommandMapKey,
  ConvertPluginResult,
  ConvertPluginResultEx,
  EEBudnleV8,
  ErrorStruct,
  ParamBuildResult,
  PluginErrorStruct,
  PluginExtractorBundle,
} from "./core";
import {
  createPluginValueExtractor,
  extractPluginParamFromRecord,
} from "./core";
import {
  defaultCommandExtractHandlers,
  extractArgsFromPluginCommandHandled,
} from "./core/command2";
import { buildSingleCommand } from "./core/commandBuild";
import type { ParamBuildErrorHandlers } from "./core/paramBuild";
import { defaultParamBuildHandlers, buildSingleParam } from "./core/paramBuild";

export const mergeCommandMap = (
  list: ReadonlyArray<CommandExtractorEntryList>,
): Map<CommandMapKey, CommandArgExtractors> => {
  const src: CommandExtractorEntry[] = list.flatMap(
    (item) => item.extractorEntries,
  );
  return new Map(src);
};

type CommandBuildResultE = CommandBuildResult<ErrorStruct>;
export const jsonPathFromPluginSchema = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
>(
  schema: PluginSchemaOf<S, A>,
  record: PluginParamsRecord,
  factoryFn: (path: string) => JSONPathReader,
): ConvertPluginResultEx<S, A> => {
  const extractor: PluginExtractorBundle = createPluginValueExtractor(
    schema.pluginName,
    schema.schema,
    factoryFn,
  );
  const { params } = extractPluginParamFromRecord(record, extractor.params);
  return {
    record: record,
    schema,
    extractorEntries: extractor.commands,
    params: params,
  };
};

export const extractArgsFromPluiginCommand = (
  command: PluginCommandData,
  map: ReadonlyMap<CommandMapKey, CommandArgExtractors>,
  handlers: CommandExtractMessageHandlers = defaultCommandExtractHandlers,
): CommandExtractResult => {
  return extractArgsFromPluginCommandHandled(command, map, handlers);
};

export const buildPluginValueExtractorV8 = (
  pluginName: string,
  schema: PluginSchemaArray,
  factoryFn: (path: string) => JSONPathReader,
  paramErrorHandlers: ParamBuildErrorHandlers<PluginErrorStruct>,
  commandErrorHandlers: BuildErrorHandlers<ErrorStruct>,
): EEBudnleV8 => {
  type MapType = ReadonlyMap<string, ClassifiedPluginParams>;
  const map: MapType = createClassifiedStructMap(schema.structs);
  return {
    pluginName,
    commands: buildCommandExtractorsV2(
      pluginName,
      schema.commands,
      map,
      factoryFn,
      commandErrorHandlers,
    ),
    params: buildParamExtractors(
      pluginName,
      schema.params,
      map,
      factoryFn,
      paramErrorHandlers,
    ),
  };
};

export const buildCommandExtractorsV2 = (
  pluginName: string,
  commands: ReadonlyArray<PluginCommandSchemaArray>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader,
  handlers: BuildErrorHandlers<ErrorStruct>,
): CommandBuildResultE => {
  return commands.reduce<CommandBuildResultE>(
    (state, command) => {
      const built = buildSingleCommand(
        pluginName,
        command,
        structMap,
        factoryFn,
        handlers,
      );
      return {
        extractors: [...state.extractors, built.extractor],
        errors: [...state.errors, ...built.errors],
      };
    },
    {
      extractors: [],
      errors: [],
    },
  );
};

export const buildParamExtractors = (
  pluginName: string,
  params: ReadonlyArray<PluginParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader,
  handlers: ParamBuildErrorHandlers<PluginErrorStruct> = defaultParamBuildHandlers,
): ParamBuildResult => {
  return params.reduce<ParamBuildResult>(
    (state, param) => {
      const built = buildSingleParam(
        pluginName,
        param,
        structMap,
        factoryFn,
        handlers,
      );
      return {
        extractors: [...state.extractors, built.extractor],
        errors: [...state.errors, ...built.errors],
      };
    },
    {
      extractors: [],
      errors: [],
    },
  );
};

/**
 * @deprecated
 * @todo エラー情報が欠落しているので、後で消す
 */
export const jsonPathFromPluginReadResult = (
  readResult: PluginReadResult,
  factoryFn: (path: string) => JSONPathReader,
): null | ConvertPluginResult => {
  if (readResult.plugin === null) {
    return null;
  }
  const schema: PluginSchemaArray = compilePluginAsArraySchema(
    readResult.plugin,
  );
  return jsonPathFromPluginSchema(
    {
      pluginName: readResult.record.name,
      schema,
    },
    readResult.record,
    factoryFn,
  );
};

/**
 * @deprecated
 * @todo エラー情報が欠落しているので、後で消す
 */
export const jsonPathFromPluginReadResults = (
  readResults: ReadonlyArray<PluginReadResult>,
  factoryFn: (path: string) => JSONPathReader,
): ConvertPluginResult[] => {
  return readResults
    .map((readResult): null | ConvertPluginResult => {
      return jsonPathFromPluginReadResult(readResult, factoryFn);
    })
    .filter((result): result is ConvertPluginResult => result !== null);
};
