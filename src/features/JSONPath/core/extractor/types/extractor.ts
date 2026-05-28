import type { PluginValuesExtractorBundle } from "./bundle";
import type { CommandArgExtractors } from "./command";
import type { ErrorStruct, PluginErrorStruct } from "./error";

export interface PluginExtractionBuildBundle {
  pluginName: string;
  commands: CommandBuildResult<ErrorStruct>;
  params: ParamBuildResult;
}

export interface ParamBuildResult<T = PluginErrorStruct> {
  extractors: PluginValuesExtractorBundle[];
  errors: T[];
}

export interface CommandBuildResult<T> {
  extractors: CommandArgExtractors[];
  errors: T[];
}
