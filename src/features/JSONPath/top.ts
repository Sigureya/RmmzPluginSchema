import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandSchemaArray,
  ClassifiedPluginParams,
  PluginParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { CommandBuildResult } from "./core";
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

type CommandBuildResultE = CommandBuildResult<ErrorStruct>;

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
