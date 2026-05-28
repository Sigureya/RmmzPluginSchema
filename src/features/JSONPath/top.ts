import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandData,
  PluginSchemaArray,
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
  PluginParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createClassifiedStructMap } from "@RmmzPluginSchema/rmmz/plugin";
import type {
  BuildErrorHandlers,
  CommandArgExtractors,
  CommandBuildResult,
  CommandExtractMessageHandlers,
  CommandExtractorEntry,
  CommandExtractorEntryList,
  CommandExtractResult,
  CommandMapKey,
  PluginExtractionBuildBundle,
  ErrorStruct,
  ParamBuildResult,
  PluginErrorStruct,
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
): PluginExtractionBuildBundle => {
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
