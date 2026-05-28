import type {
  PluginCommandExtractErrorHandlers,
  CommandExtractError,
  CommandBuildErrorHandlers,
  ErrorStruct,
  StructPathError,
  PluginErrorStruct,
} from "./features";
import type { ParamBuildErrorHandlers } from "./features/JSONPath/core/paramBuild";

export const defaultPluginCommandExtractErrorHandlers: PluginCommandExtractErrorHandlers =
  {
    commandNotFoundError: (context): CommandExtractError => ({
      message: `undefined command: ${context.pluginName}:${context.commandName}`,
      source: "commandNotFoundError",
    }),
    commandParseError: (context, error): CommandExtractError => ({
      message: `parse failed: ${context.pluginName}:${context.commandName}: ${String(error)}`,
      source: "commandParseError",
    }),
    commandArgsError: (context, error): CommandExtractError => ({
      message: `extract args failed: ${context.pluginName}:${context.commandName}: ${String(error)}`,
      source: "commandArgsError",
    }),
  };
export const defaultCommandBuildErrorHandlers: CommandBuildErrorHandlers<ErrorStruct> =
  {
    commandStructPathError: (context, error: StructPathError) => ({
      code: error.code,
      source: "createPath",
      pluginName: context.pluginName,
      commandName: context.commandName,
      argName: context.argName,
      path: error.path,
      message: `${error.code}: ${error.path}`,
    }),
    commandCompileJSONPathSchemaError: (context, error: unknown) => ({
      code: "compile_jsonpath_schema_error",
      source: "compileJSONPathSchema",
      pluginName: context.pluginName,
      commandName: context.commandName,
      argName: context.argName,
      message: String(error),
    }),
  };
export const defaultPluginParamBuildErrorHandlers: ParamBuildErrorHandlers<PluginErrorStruct> =
  {
    paramStructPathError: (context, error) => ({
      code: error.code,
      source: "createPath",
      pluginName: context.pluginName,
      paramName: context.paramName,
      path: error.path,
      message: `${error.code}: ${error.path}`,
    }),
    paramCompileJSONPathSchemaError: (context, error) => ({
      code: "compile_jsonpath_schema_error",
      source: "compileJSONPathSchema",
      pluginName: context.pluginName,
      paramName: context.paramName,
      message: String(error),
    }),
  };
