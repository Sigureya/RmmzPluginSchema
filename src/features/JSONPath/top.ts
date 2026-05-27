import type { PluginReadResult } from "@RmmzPluginSchema/fileio/types";
import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandSchemaArray,
  ClassifiedPluginParams,
  PluginParam,
  PluginSchemaArray,
  PluginCommandData,
  PluginArrayParamType,
  PluginParamsRecord,
  PluginScalarParam,
  PluginSchemaOf,
} from "@RmmzPluginSchema/rmmz/plugin";
import { compilePluginAsArraySchema } from "@RmmzPluginSchema/rmmz/plugin";
import {
  createPluginValueExtractor,
  extractPluginParamFromRecord,
  type CommandArgExtractors,
  type CommandBuildResult,
  type CommandExtractMessageHandlers,
  type CommandExtractResult,
  type CommandMapKey,
} from "./core";
import { extractArgsFromPluginCommandHandled } from "./core/command2";
import { buildSingleCommand, defaultHandlers } from "./core/commandBuild";
import type { BuildErrorHandlers } from "./core/createPath/types/handlers";
import type {
  ErrorStruct,
  PluginErrorStruct,
} from "./core/extractor/types/error";
import type {
  ParamBuildErrorHandlers,
  ParamBuildResult,
} from "./core/paramBuild";
import { defaultParamBuildHandlers, buildSingleParam } from "./core/paramBuild";
import type {
  ConvertPluginResult,
  ConvertPluginResultEx,
  PluginExtractorBundle,
} from "./core/types";
import { defaultCommandExtractHandlers } from "./pluginOld";

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

export const buildCommandExtractorsV2 = (
  pluginName: string,
  commands: ReadonlyArray<PluginCommandSchemaArray>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader,
  handlers: BuildErrorHandlers<ErrorStruct> = defaultHandlers,
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
